CREATE TABLE tournaments (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    banner_url TEXT,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    max_teams INT NOT NULL DEFAULT 8,
    points_win INT NOT NULL DEFAULT 3,
    points_draw INT NOT NULL DEFAULT 1,
    points_loss INT NOT NULL DEFAULT 0,
    notes TEXT,
    rejection_reason TEXT,
    status ENUM('draft','pending_approval','approved','rejected','registration_open','in_progress','finished') NOT NULL DEFAULT 'draft',
    organizer_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_tournament_organizer FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE CASCADE
);
