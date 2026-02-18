-- Email Logs Table for Internship System
CREATE TABLE IF NOT EXISTS internship_email_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_id INT NOT NULL,
    stage VARCHAR(50) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES internship_applications(id) ON DELETE CASCADE,
    INDEX idx_application_id (application_id),
    INDEX idx_sent_at (sent_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
