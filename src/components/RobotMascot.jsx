export default function RobotMascot({ message }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        flexWrap: "wrap"
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          animation: "robotMascotBounce 3s ease-in-out infinite",
          filter: "drop-shadow(0 10px 18px rgba(62, 115, 194, 0.18))"
        }}
      >
        <div
          style={{
            width: 22,
            height: 14,
            marginBottom: -6,
            borderRadius: "999px 999px 10px 10px",
            background: "linear-gradient(180deg, #80d7ff 0%, #62b7ff 100%)",
            boxShadow: "0 2px 0 rgba(255,255,255,0.75) inset"
          }}
        />

        <div
          style={{
            position: "relative",
            width: 82,
            height: 78,
            background: "radial-gradient(circle at 35% 28%, #ffffff 0%, #f8fbff 55%, #d9ebff 100%)",
            borderRadius: "50%",
            border: "2px solid #b9d9fb",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            zIndex: 2
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 20,
              left: -11,
              width: 18,
              height: 32,
              background: "linear-gradient(180deg, #9fe2ff 0%, #6fb9ff 100%)",
              borderRadius: "16px 10px 10px 16px",
              boxShadow: "0 0 0 2px #d8edff inset"
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 20,
              right: -11,
              width: 18,
              height: 32,
              background: "linear-gradient(180deg, #9fe2ff 0%, #6fb9ff 100%)",
              borderRadius: "10px 16px 16px 10px",
              boxShadow: "0 0 0 2px #d8edff inset"
            }}
          />
          <div style={{ display: "flex", gap: 14, marginTop: 4 }}>
            {[0, 0.07].map((delay, index) => (
              <div
                key={index}
                style={{
                  width: 21,
                  height: 25,
                  background:
                    "radial-gradient(circle at 35% 28%, #5763a7 0%, #1f254d 30%, #10152f 72%, #090d1d 100%)",
                  borderRadius: "50% 50% 48% 48%",
                  position: "relative",
                  animation: `robotMascotBlink 3.8s ease-in-out ${delay}s infinite`
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 4,
                    left: 5,
                    width: 7,
                    height: 7,
                    background: "#fff",
                    borderRadius: "50%"
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 5,
                    right: 4,
                    width: 5,
                    height: 5,
                    background: "rgba(141, 211, 255, 0.4)",
                    borderRadius: "50%"
                  }}
                />
              </div>
            ))}
          </div>
          <div
            style={{
              width: 18,
              height: 8,
              border: "2px solid #5e6aa3",
              borderTop: "none",
              borderRadius: "0 0 12px 12px",
              marginTop: -3
            }}
          />
        </div>

        <div style={{ width: 10, height: 1, background: "transparent" }} />

        <div style={{ display: "flex", alignItems: "center", marginTop: -10 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div
              style={{
                width: 13,
                height: 26,
                background: "linear-gradient(180deg, #f5fbff 0%, #d9ecff 100%)",
                borderRadius: "999px",
                border: "2px solid #b8dafb",
                transform: "rotate(16deg) translateX(5px)"
              }}
            />
          </div>

          <div
            style={{
              width: 60,
              height: 52,
              background: "radial-gradient(circle at 30% 25%, #ffffff 0%, #f7fbff 50%, #d8ebff 100%)",
              borderRadius: "28px 28px 24px 24px",
              border: "2px solid #b8dafb",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 7,
              position: "relative"
            }}
          >
            <div
              style={{
                width: 36,
                height: 6,
                background: "linear-gradient(90deg, #7ecfff 0%, #66b6ff 100%)",
                borderRadius: 999
              }}
            />
            <div
              style={{
                width: 11,
                height: 11,
                background: "linear-gradient(180deg, #5aa6ff 0%, #2e7fda 100%)",
                borderRadius: "50%",
                animation: "robotMascotPulse 2.2s ease-in-out infinite"
              }}
            />
            <div
              style={{
                position: "absolute",
                left: "50%",
                bottom: 10,
                width: 40,
                height: 6,
                transform: "translateX(-50%)",
                borderRadius: 999,
                border: "2px solid #8fc8ff",
                borderLeft: "none",
                borderRight: "none"
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              animation: "robotMascotArmBob 2.2s ease-in-out infinite"
            }}
          >
            <div
              style={{
                width: 13,
                height: 26,
                background: "linear-gradient(180deg, #f5fbff 0%, #d9ecff 100%)",
                borderRadius: "999px",
                border: "2px solid #b8dafb",
                transform: "rotate(-16deg) translateX(-5px)"
              }}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 0 }}>
          {[0, 1].map((index) => (
            <div key={index} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div
                style={{
                  width: 14,
                  height: 14,
                  background: "linear-gradient(180deg, #dff0ff 0%, #c3e1ff 100%)",
                  borderRadius: 7,
                  border: "2px solid #b8dafb"
                }}
              />
              <div
                style={{
                  width: 20,
                  height: 8,
                  background: "#fff",
                  borderRadius: 999,
                  border: "2px solid #b8dafb",
                  marginTop: -2,
                  boxShadow: "0 2px 0 rgba(154, 203, 255, 0.3) inset"
                }}
              />
            </div>
          ))}
        </div>

        <div
          style={{
            width: 46,
            height: 10,
            marginTop: 4,
            borderRadius: "50%",
            background: "rgba(75, 128, 197, 0.12)",
            filter: "blur(1px)"
          }}
        />
      </div>

      <div
        style={{
          background: "rgba(255, 255, 255, 0.96)",
          border: "1px solid #d7e8fb",
          borderRadius: "18px 18px 18px 6px",
          padding: "15px 20px",
          fontSize: 15,
          fontWeight: 600,
          color: "#1e2a3b",
          lineHeight: 1.7,
          marginBottom: 42,
          marginLeft: 8,
          animation: "robotMascotFloat 2.8s ease-in-out infinite",
          whiteSpace: "pre-line",
          boxShadow: "0 10px 24px rgba(41, 90, 158, 0.12)",
          maxWidth: 220,
          minHeight: 78,
          display: "flex",
          alignItems: "center"
        }}
      >
        {message}
      </div>

      <style>{`
        @keyframes robotMascotBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        @keyframes robotMascotBlink { 0%,43%,57%,100%{transform:scaleY(1)} 50%{transform:scaleY(0.07)} }
        @keyframes robotMascotPulse { 0%,85%,100%{opacity:1} 92%{opacity:0.2} }
        @keyframes robotMascotFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        @keyframes robotMascotArmBob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(2px)} }
      `}</style>
    </div>
  );
}
