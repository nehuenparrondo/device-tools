-- database/seed.sql — Datos ficticios para una BD de práctica, nunca cargados en la app.
PRAGMA foreign_keys=ON;
BEGIN TRANSACTION;
INSERT INTO records(id,tool_id,created_at,note) VALUES
(1,1,'2026-10-07T12:00:00.000Z','Foto ficticia de ejemplo'),
(2,2,'2026-10-07T12:01:00.000Z','QR de texto de prueba'),
(3,3,'2026-10-07T12:02:00.000Z','Punto GPS de ejemplo');
INSERT INTO photos(record_id,uri,width,height,facing) VALUES (1,'file:///example/photo.jpg',1200,1600,'back');
INSERT INTO scans(record_id,barcode_type,content) VALUES (2,'qr','Ejemplo académico');
INSERT INTO locations(record_id,latitude,longitude,accuracy,altitude,speed,heading,address)
VALUES (3,-34.6037,-58.3816,12,NULL,NULL,NULL,'Buenos Aires, Argentina');
INSERT INTO tags(id,name) VALUES (1,'clase'),(2,'prueba');
INSERT INTO record_tags(record_id,tag_id) VALUES (1,1),(2,1),(2,2),(3,2);
COMMIT;
