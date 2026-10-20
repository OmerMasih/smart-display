import "./App.css";

function App() {
  return (
    <main className="display">
      <header className="header">
        <div>
          <h1>SMART DISPLAY</h1>
          <p>Company Information Center</p>
        </div>

        <div className="status">
          <span className="status-dot"></span>
          System Online
        </div>
      </header>

      <section className="announcements">
        <article className="announcement announcement-blue">
          <h2>IT SUPPORT</h2>
          <p>For technical assistance, please contact the IT Support Team.</p>
          <span>Support • Service • Solutions</span>
        </article>

        <article className="announcement announcement-orange">
          <h2>IMPORTANT NOTICE</h2>
          <p>
            Please wear your identification badge while inside the building.
          </p>
          <span>Safety starts with you.</span>
        </article>
      </section>

      <footer className="ticker">
        <strong>ANNOUNCEMENT</strong>
        <p>
          Welcome! Please check this screen regularly for important company
          updates.
        </p>
      </footer>
    </main>
  );
}

export default App;
