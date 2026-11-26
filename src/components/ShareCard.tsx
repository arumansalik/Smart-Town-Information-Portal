
export default function ShareCard() {
    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "58px",
                color: "#ffffff",
                background:
                    "linear-gradient(135deg, #102a43 0%, #075985 55%, #0f766e 100%)",
                fontFamily: "Arial, sans-serif",
                position: "relative",
                overflow: "hidden",
            }}
        >
            <div
                style={{
                    position: "absolute",
                    right: -100,
                    top: -130,
                    width: 440,
                    height: 440,
                    borderRadius: 220,
                    background: "rgba(255,255,255,0.07)",
                    display: "flex",
                }}
            />

            <div style={{ display: "flex", flexDirection: "column" }}>
                <div
                    style={{
                        fontSize: 27,
                        fontWeight: 800,
                        letterSpacing: 3,
                        color: "#99f6e4",
                        display: "flex",
                    }}
                >
                    NAMMA TPR
                </div>

                <div
                    style={{
                        fontSize: 64,
                        fontWeight: 800,
                        lineHeight: 1.12,
                        marginTop: 38,
                        maxWidth: 750,
                        display: "flex",
                    }}
                >
                    Your town. All in one place.
                </div>

                <div
                    style={{
                        fontSize: 27,
                        color: "#dbeafe",
                        marginTop: 24,
                        display: "flex",
                    }}
                >
                    Discover Tiruppattur, Tamil Nadu
                </div>
            </div>

            <div style={{ display: "flex", gap: 14 }}>
                {["Local Jobs", "Shops", "Local Services"].map((item) => (
                    <div
                        key={item}
                        style={{
                            display: "flex",
                            padding: "15px 23px",
                            borderRadius: 14,
                            background: "rgba(255,255,255,0.14)",
                            border: "1px solid rgba(255,255,255,0.3)",
                            fontSize: 21,
                            fontWeight: 600,
                        }}
                    >
                        {item}
                    </div>
                ))}
            </div>

            <div
                style={{
                    position: "absolute",
                    right: 58,
                    bottom: 105,
                    fontSize: 22,
                    color: "#ccfbf1",
                    display: "flex",
                }}
            >
                nammatpr.in
            </div>
        </div>
    );
}
