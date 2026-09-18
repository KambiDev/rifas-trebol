CREATE DATABASE IF NOT EXISTS rifas_trebol
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE rifas_trebol;

CREATE TABLE IF NOT EXISTS usuarios (
  id            INT          NOT NULL AUTO_INCREMENT,
  name          VARCHAR(100) NOT NULL,
  username      VARCHAR(50)  NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role          ENUM('admin', 'vendor') NOT NULL DEFAULT 'vendor',
  active        BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS authorized_devices (
  id          INT          NOT NULL AUTO_INCREMENT,
  user_id     INT          NOT NULL,
  device_id   VARCHAR(255) NOT NULL,
  linked_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_device_id (device_id),
  CONSTRAINT fk_device_user FOREIGN KEY (user_id)
    REFERENCES usuarios(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS games (
  id                INT           NOT NULL AUTO_INCREMENT,
  name              VARCHAR(100)  NOT NULL,
  active            BOOLEAN       NOT NULL DEFAULT TRUE,
  prize_multiplier  DECIMAL(7,2)  NOT NULL DEFAULT 50.00,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS draws (
  id             INT  NOT NULL AUTO_INCREMENT,
  game_id        INT  NOT NULL,
  shift          ENUM('morning', 'afternoon', 'night') NOT NULL,
  draw_date      DATE NOT NULL,
  winning_number VARCHAR(20)  DEFAULT NULL,
  status         ENUM('open', 'closed', 'finished') NOT NULL DEFAULT 'open',
  created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_draw_per_day (game_id, shift, draw_date),
  CONSTRAINT fk_draw_game FOREIGN KEY (game_id)
    REFERENCES games(id) ON UPDATE CASCADE,
  INDEX idx_draws_date   (draw_date),
  INDEX idx_draws_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS tickets (
  id             INT           NOT NULL AUTO_INCREMENT,
  unique_code    VARCHAR(8)    NOT NULL,
  user_id        INT           NOT NULL,
  draw_id        INT           NOT NULL,
  played_number  VARCHAR(20)   NOT NULL,
  amount         DECIMAL(10,2) NOT NULL,
  status         ENUM('pending', 'winner', 'paid', 'cancelled') NOT NULL DEFAULT 'pending',
  created_at     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_unique_code (unique_code),
  CONSTRAINT fk_ticket_user FOREIGN KEY (user_id)
    REFERENCES usuarios(id) ON UPDATE CASCADE,
  CONSTRAINT fk_ticket_draw FOREIGN KEY (draw_id)
    REFERENCES draws(id) ON UPDATE CASCADE,
  INDEX idx_tickets_draw      (draw_id),
  INDEX idx_tickets_user      (user_id),
  INDEX idx_tickets_status    (status),
  INDEX idx_tickets_created   (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS cash_movements (
  id           INT           NOT NULL AUTO_INCREMENT,
  user_id      INT           NOT NULL,
  type         ENUM('sale', 'prize_payment', 'cancellation', 'adjustment') NOT NULL,
  amount       DECIMAL(10,2) NOT NULL,
  reference_id INT           DEFAULT NULL,
  description  VARCHAR(255)  DEFAULT NULL,
  created_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_movement_user FOREIGN KEY (user_id)
    REFERENCES usuarios(id) ON UPDATE CASCADE,
  INDEX idx_movements_date (created_at),
  INDEX idx_movements_type (type),
  INDEX idx_movements_ref  (reference_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO games (name, prize_multiplier) VALUES
  ('Nica',         50.00),
  ('Día/Mes',      50.00),
  ('Nica 3',      500.00),
  ('Tica',         50.00),
  ('Tres Monasos', 150.00),
  ('Hondureña',    50.00),
  ('La Primera',   50.00),
  ('Salvadoreña',  50.00);
