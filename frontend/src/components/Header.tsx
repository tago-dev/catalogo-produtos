import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <header className="app-header">
            <div className="container header-inner">
                <Link to="/" className="logo">Catálogo</Link>
                <nav>
                    <Link to="/" className="nav-link">Produtos</Link>
                    <Link to="/dashboard" className="nav-link">Dashboard</Link>
                </nav>
            </div>
        </header>
    );
}
