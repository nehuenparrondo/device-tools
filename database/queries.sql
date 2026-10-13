-- database/queries.sql — Consultas estáticas ilustrativas; la app siempre parametriza entradas.
SELECT r.id,t.name,r.created_at,r.note FROM records r
JOIN tools t ON t.id=r.tool_id ORDER BY r.created_at DESC,r.id DESC;
SELECT t.name,COUNT(r.id) AS total FROM tools t
LEFT JOIN records r ON r.tool_id=t.id GROUP BY t.id,t.name;
SELECT r.id,s.barcode_type,s.content FROM records r
JOIN scans s ON s.record_id=r.id WHERE s.barcode_type='qr';
SELECT r.id,l.latitude,l.longitude,l.accuracy,l.address FROM records r
JOIN locations l ON l.record_id=r.id ORDER BY r.created_at DESC;
SELECT r.id,t.name FROM records r JOIN record_tags rt ON rt.record_id=r.id
JOIN tags t ON t.id=rt.tag_id ORDER BY r.id,t.name;
SELECT t.name,COUNT(rt.record_id) AS uses FROM tags t
LEFT JOIN record_tags rt ON rt.tag_id=t.id GROUP BY t.id,t.name ORDER BY uses DESC;
