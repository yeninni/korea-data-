/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        civic: {
          50: "#f5f9ff",
          100: "#e7f0fb",
          500: "#256fae",
          600: "#1f5f96",
          700: "#194b78",
          900: "#132b45"
        },
        transit: {
          400: "#21a89a",
          500: "#168c80"
        }
      },
      fontFamily: {
        sans: [
          "Pretendard",
          "Noto Sans",
          "Noto Sans KR",
          "Apple SD Gothic Neo",
          "Malgun Gothic",
          "sans-serif"
        ],
        soft: [
          "Gowun Dodum",
          "Pretendard",
          "Noto Sans KR",
          "Apple SD Gothic Neo",
          "Malgun Gothic",
          "sans-serif"
        ],
        display: [
          "Isamanru",
          "Pretendard",
          "Noto Sans KR",
          "Apple SD Gothic Neo",
          "Malgun Gothic",
          "sans-serif"
        ]
      },
      boxShadow: {
        civic: "0 22px 60px rgba(19, 43, 69, 0.12)"
      }
    }
  },
  plugins: []
};
