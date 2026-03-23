export function DotMatrixBackground() {
    return (
        <div className="fixed inset-0 z-0 bg-black pointer-events-none">
            {/* Base Grid */}
            <div
                className="absolute inset-0 opacity-[0.15]"
                style={{
                    backgroundImage: `radial-gradient(#4b5563 1px, transparent 1px)`,
                    backgroundSize: '24px 24px'
                }}
            />

            {/* Wave overlay - simulating the flow in Image 2 */}
            <div className="absolute inset-0 bg-linear-to-tr from-black via-transparent to-black opacity-80" />

            {/* Radial glow for depth */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-900/20 rounded-full blur-[120px]" />

            {/* Second subtle glow */}
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-emerald-900/10 rounded-full blur-[100px]" />
        </div>
    )
}
