export const metadata = {
  title: "Pickleball Tournament Director",
  description: "Manage your pickleball tournaments easily",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          margin: 0,
          padding: 0,
          backgroundColor: "#f9fafb",
        }}
      >
        {children}
      </body>
    </html>
  );
}
