const Layout = ({children }) => {
  return (
    <div>
      <nav className="bg-violet-400 p-4 text-white flex justify-between">
        <h1 className="text-2xl font-semibold">E-Kart</h1>
        <a href="/">Home</a>
        <a href="/register">Register</a>
        <a href="/login">Login</a>
      </nav>
      <main className="container mx-auto mt-4">{children}</main>
      
    </div>
  );
  
      
}

export default Layout