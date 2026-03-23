import sys
import os
import traceback

# Add current directory to path
sys.path.append(os.getcwd())

print("Attempting to import app.main...")

try:
    from app.main import app
    print("Success! app.main imported correctly.")
except Exception as e:
    print("\nCRITICAL ERROR IMPORTING APP:")
    traceback.print_exc()
