function NotFoundPage() {
    return (
        <div className="page-container">
            <div className="not-found-card">
                <h1>404</h1>
                <h2>Page Not Found</h2>
                <p>
                    Sorry, the page you're looking for doesn't exist.
                </p>
                <a href="/tasks" className="not-found-link">
                    Go to Tasks →
                </a>
            </div>
        </div>
    );
}

export default NotFoundPage;
