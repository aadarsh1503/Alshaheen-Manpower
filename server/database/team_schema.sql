-- Team Members Table
CREATE TABLE IF NOT EXISTS team_members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  image_url TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default team members
INSERT INTO team_members (name, role, image_url, display_order, is_active) VALUES
('RIYADH SHAHEEN', 'MANAGING DIRECTOR', '/team/riyadh.png', 1, TRUE),
('MARIA BERNADETH CASTRO', 'ADMINISTRATOR', '/team/maria.png', 2, TRUE),
('ASMAN RAHIM', 'TECHNOLOGY OFFICER', '/team/asman.png', 3, TRUE),
('SHAMEEMUDHEEN KANNAMPURATH VALAPPIL', 'HRM SALES EXECUTIVE', '/team/shameemudheen.png', 4, TRUE),
('MARICRIS ANGELES', 'ACCOUNTANT', '/team/maricris.png', 5, TRUE);
