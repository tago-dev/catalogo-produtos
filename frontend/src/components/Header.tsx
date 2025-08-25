import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <header className="app-header">
            <div className="container-wide">
                <div className="app-header-inner">
                    <Link to="/" className="brand">Catálogo</Link>
                    <nav className="nav">
                        <Link to="/">Produtos</Link>
                        <Link to="/dashboard">Dashboard</Link>
                    </nav>
                </div>
            </div>
        </header>
    );
}
