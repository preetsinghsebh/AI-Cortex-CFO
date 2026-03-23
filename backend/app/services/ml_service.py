import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, f1_score
import logging

try:
    from prophet import Prophet
    PROPHET_AVAILABLE = True
except ImportError:
    PROPHET_AVAILABLE = False
    
try:
    from pmdarima import auto_arima
    from sklearn.metrics import mean_squared_error, mean_absolute_error
    PMDARIMA_AVAILABLE = True
except ImportError:
    PMDARIMA_AVAILABLE = False

logger = logging.getLogger(__name__)

class MLService:
    def __init__(self):
        self.risk_model = None

    def fetch_historical_data(self, symbol: str, period="2y"):
        if not symbol.endswith(".NS") and not symbol.endswith(".BO") and not "^" in symbol:
            symbol = f"{symbol}.NS"
        ticker = yf.Ticker(symbol)
        df = ticker.history(period=period)
        if df.empty:
            raise ValueError(f"No historical data found for {symbol}")
        df = df.reset_index()
        # Ensure timezone-naive for Prophet
        if df['Date'].dt.tz is not None:
            df['Date'] = df['Date'].dt.tz_localize(None)
        return df

    def predict_stock_price(self, symbol: str, forecast_days: int = 7):
        """Forecasting using Prophet (preferred) or ARIMA"""
        df = self.fetch_historical_data(symbol, period="1y")
        
        # Prepare data
        metric_data = df[['Date', 'Close']].rename(columns={'Date': 'ds', 'Close': 'y'})
        
        # Split into train/test for evaluation metrics
        train_size = int(len(metric_data) * 0.9) # 90% train, 10% test
        train = metric_data.iloc[:train_size]
        test = metric_data.iloc[train_size:]
        
        actuals = test['y'].values
        
        if PROPHET_AVAILABLE:
            # Train Prophet
            m = Prophet(daily_seasonality=True, yearly_seasonality=True)
            m.fit(train)
            
            # Predict for test set to get metrics
            future_test = m.make_future_dataframe(periods=len(test))
            forecast_test = m.predict(future_test)
            predictions = forecast_test['yhat'].iloc[-len(test):].values
            
            rmse = np.sqrt(np.mean((actuals - predictions)**2))
            mae = np.mean(np.abs(actuals - predictions))
            
            # Now train on FULL dataset for future forecast
            m_full = Prophet(daily_seasonality=True, yearly_seasonality=True)
            m_full.fit(metric_data)
            future = m_full.make_future_dataframe(periods=forecast_days)
            forecast = m_full.predict(future)
            
            recent_forecast = forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(forecast_days)
            
            forecast_data = []
            for _, row in recent_forecast.iterrows():
                forecast_data.append({
                    "date": row['ds'].strftime('%Y-%m-%d'),
                    "predicted_price": round(row['yhat'], 2),
                    "lower_bound": round(row['yhat_lower'], 2),
                    "upper_bound": round(row['yhat_upper'], 2)
                })
                
            return {
                "symbol": symbol,
                "model": "Prophet",
                "metrics": {
                    "RMSE": round(rmse, 2),
                    "MAE": round(mae, 2)
                },
                "forecast": forecast_data
            }
        elif PMDARIMA_AVAILABLE:
            # Fallback to ARIMA
            model = auto_arima(train['y'], suppress_warnings=True, seasonal=False)
            predictions = model.predict(n_periods=len(test))
            
            rmse = np.sqrt(np.mean((actuals - predictions.values)**2))
            mae = np.mean(np.abs(actuals - predictions.values))
            
            # Full model
            model_full = auto_arima(metric_data['y'], suppress_warnings=True, seasonal=False)
            forecast = model_full.predict(n_periods=forecast_days)
            
            forecast_data = []
            last_date = metric_data['ds'].iloc[-1]
            for i, pred in enumerate(forecast):
                next_date = last_date + timedelta(days=i+1)
                forecast_data.append({
                    "date": next_date.strftime('%Y-%m-%d'),
                    "predicted_price": round(pred, 2),
                })
                
            return {
                "symbol": symbol,
                "model": "ARIMA",
                "metrics": {
                    "RMSE": round(rmse, 2),
                    "MAE": round(mae, 2)
                },
                "forecast": forecast_data
            }
        else:
            raise RuntimeError("Neither Prophet nor ARIMA is available. Please install 'prophet' or 'pmdarima'.")

    def classify_stock_risk(self, symbol: str):
        """
        Classifies stock risk (Low/Medium/High) using Logistic Regression.
        Features: Volatility (30d), Price Change % (30d), Avg Daily Volume (30d).
        """
        # Fetch 6 months of data
        df = self.fetch_historical_data(symbol, period="6mo")
        
        # Calculate features on rolling 30-day windows to build a dataset
        df['Returns'] = df['Close'].pct_change()
        df['Volatility'] = df['Returns'].rolling(window=30).std() * np.sqrt(252) * 100 # Annualized volatility %
        df['Price_Change_Pct'] = df['Close'].pct_change(periods=30) * 100
        df['Volume_MA_30'] = df['Volume'].rolling(window=30).mean()
        
        df = df.dropna()
        if len(df) < 30:
            raise ValueError(f"Not enough data to calculate risk metrics for {symbol}")
            
        def assign_risk_label(vol):
            if vol < 18: return 0 # Low Risk
            elif vol < 35: return 1 # Medium Risk
            else: return 2 # High Risk
            
        df['Risk_Label'] = df['Volatility'].apply(assign_risk_label)
        
        features = ['Volatility', 'Price_Change_Pct', 'Volume_MA_30']
        X = df[features]
        y = df['Risk_Label']
        
        split_idx = int(len(df) * 0.8)
        X_train, X_test = X.iloc[:split_idx], X.iloc[split_idx:]
        y_train, y_test = y.iloc[:split_idx], y.iloc[split_idx:]
        
        clf = LogisticRegression(class_weight='balanced', max_iter=1000)
        if len(y_train.unique()) > 1:
            clf.fit(X_train, y_train)
            if len(X_test) > 0:
                y_pred = clf.predict(X_test)
                acc = accuracy_score(y_test, y_pred)
                # handle cases where not all classes are predicted
                f1 = f1_score(y_test, y_pred, average='weighted', zero_division=0)
            else:
                acc, f1 = 1.0, 1.0
            coef = clf.coef_[0].tolist() if hasattr(clf, "coef_") else [0]*len(features)
        else:
            acc = 1.0 
            f1 = 1.0
            coef = [0, 0, 0]
            clf.fit(X_train, y_train)
            
        latest_stats = df.iloc[-1]
        X_latest = pd.DataFrame([latest_stats[features]])
        
        pred_label = clf.predict(X_latest)[0]
        risk_mapping = {0: "LOW", 1: "MEDIUM", 2: "HIGH"}
        
        return {
            "symbol": symbol,
            "risk_tier": risk_mapping[pred_label],
            "metrics": {
                "Model_Accuracy": round(acc, 3),
                "F1_Score": round(f1, 3)
            },
            "features": {
                "volatility_annualized_pct": round(latest_stats['Volatility'], 2),
                "price_change_30d_pct": round(latest_stats['Price_Change_Pct'], 2),
                "avg_volume_30d": int(latest_stats['Volume_MA_30'])
            },
            "feature_importance_weights": {
                "volatility": round(coef[0], 4) if len(coef) > 0 else 0,
                "price_change": round(coef[1], 4) if len(coef) > 1 else 0,
                "volume": round(coef[2], 4) if len(coef) > 2 else 0
            }
        }

ml_service = MLService()
