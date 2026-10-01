-- Add Motor Graders and Bulldozers to Construction Equipment,
-- remove duplicate Forklifts from Material Handling (kept under Cranes & Lifting).
-- Safe to re-run: INSERT uses ON CONFLICT, DELETE is a no-op if already removed.
DO $$
DECLARE
  construction_id UUID;
  material_id UUID;
BEGIN
  SELECT id INTO construction_id FROM categories WHERE slug = 'construction-equipment';
  SELECT id INTO material_id FROM categories WHERE slug = 'material-handling';

  -- Construction Equipment: new subcategories
  INSERT INTO subcategories (category_id, name, slug) VALUES
    (construction_id, 'Bulldozers', 'bulldozers'),
    (construction_id, 'Motor Graders', 'motor-graders')
  ON CONFLICT (category_id, slug) DO NOTHING;

  -- Material Handling: remove duplicate Forklifts.
  -- listings store category/subcategory as text slugs (no FK to this table), so
  -- existing 'forklifts' listings keep working — the slug remains valid under
  -- Cranes & Lifting, which is where the UI now exposes it.
  DELETE FROM subcategories
  WHERE category_id = material_id
    AND slug = 'forklifts';
END $$;
