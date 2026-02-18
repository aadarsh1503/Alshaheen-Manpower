-- Settings Table for Contact Info and Social Media
CREATE TABLE IF NOT EXISTS site_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default settings
INSERT INTO site_settings (setting_key, setting_value) VALUES
('contact_address', 'FLAT 22, BLDG 661, BLOCK 712, ROAD 1208, MANAMA, BAHRAIN'),
('contact_phone', '+973 13303301 (Ext. 100 / 102 / 103)'),
('contact_email', 'info@alshaheen.pro'),
('social_facebook', 'https://www.facebook.com/Alshaheen.pro/'),
('social_instagram', 'https://www.instagram.com/alshaheen_manpower/'),
('social_linkedin', 'https://www.linkedin.com/in/alshaheen-manpower-144096339/'),
('social_twitter', 'https://x.com/Alshaheen_Pro')
ON DUPLICATE KEY UPDATE setting_value=VALUES(setting_value);

-- News & Events Table
CREATE TABLE IF NOT EXISTS news_events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  heading VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default news/events
INSERT INTO news_events (heading, description, image_url, display_order, is_active) VALUES
('AL SHAHEEN MANPOWER Dubai LAUNCH', 'We are thrilled to announce our Healthcare Wellness Day, a special event designed to promote healthier living and provide valuable resources.', NULL, 1, TRUE),
('LAUNCH OF AL SHAHEEN MANPOWER AT DUBAI', 'Announcing the official launch of our new Dubai office, a milestone in our journey to extend our reach in a dynamic global hub.', NULL, 2, TRUE),
('AL SHAHEEN MANPOWER LAUNCHES WORKA', 'Al Shaheen Manpower was founded to empower people worldwide, connecting them with the right job opportunities and talent across all industries.', NULL, 3, TRUE),
('STRATEGIC PARTNERSHIP ANNOUNCED', 'A new strategic partnership that will redefine industry standards and create unparalleled value for our clients and stakeholders.', NULL, 4, TRUE),
('INNOVATION IN GLOBAL RECRUITMENT', 'Discover how our new technology platform is revolutionizing global recruitment, making it faster and more efficient than ever before.', NULL, 5, TRUE);
