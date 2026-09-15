-- Seed subcategories for each category
DO $$
DECLARE
  construction_id UUID;
  agriculture_id UUID;
  trucks_id UUID;
  cranes_id UUID;
  marine_id UUID;
  oil_gas_id UUID;
  material_id UUID;
  attachments_id UUID;
BEGIN
  -- Get category IDs
  SELECT id INTO construction_id FROM categories WHERE slug = 'construction-equipment';
  SELECT id INTO agriculture_id FROM categories WHERE slug = 'agriculture';
  SELECT id INTO trucks_id FROM categories WHERE slug = 'trucks-trailers';
  SELECT id INTO cranes_id FROM categories WHERE slug = 'cranes-lifting';
  SELECT id INTO marine_id FROM categories WHERE slug = 'marine-equipment';
  SELECT id INTO oil_gas_id FROM categories WHERE slug = 'oil-gas';
  SELECT id INTO material_id FROM categories WHERE slug = 'material-handling';
  SELECT id INTO attachments_id FROM categories WHERE slug = 'attachments-parts';

  -- Construction Equipment
  INSERT INTO subcategories (category_id, name, slug) VALUES
    (construction_id, 'Aggregate Handling Equipment', 'aggregate-handling-equipment'),
    (construction_id, 'Air Compressors', 'air-compressors'),
    (construction_id, 'Articulated Dump Trucks', 'articulated-dump-trucks'),
    (construction_id, 'Asphalt Compactor', 'asphalt-compactor'),
    (construction_id, 'Dozers', 'dozers'),
    (construction_id, 'Wheel Loader', 'wheel-loader'),
    (construction_id, 'Excavators', 'excavators'),
    (construction_id, 'Skid Steer Loaders', 'skid-steer-loaders'),
    (construction_id, 'Loader Backhoes', 'loader-backhoes'),
    (construction_id, 'Pipelayers', 'pipelayers'),
    (construction_id, 'Scrapers', 'scrapers'),
    (construction_id, 'Trenchers', 'trenchers'),
    (construction_id, 'Compactors', 'compactors');

  -- Agriculture
  INSERT INTO subcategories (category_id, name, slug) VALUES
    (agriculture_id, 'Tractors', 'tractors'),
    (agriculture_id, 'Harvesters', 'harvesters'),
    (agriculture_id, 'Balers', 'balers'),
    (agriculture_id, 'Plows & Cultivators', 'plows-cultivators'),
    (agriculture_id, 'Seeders & Planters', 'seeders-planters'),
    (agriculture_id, 'Sprayers', 'sprayers'),
    (agriculture_id, 'Irrigation Equipment', 'irrigation-equipment'),
    (agriculture_id, 'Hay & Forage Equipment', 'hay-forage-equipment'),
    (agriculture_id, 'Trailers', 'trailers');

  -- Trucks & Trailers
  INSERT INTO subcategories (category_id, name, slug) VALUES
    (trucks_id, 'Dump Trucks', 'dump-trucks'),
    (trucks_id, 'Flatbed Trucks', 'flatbed-trucks'),
    (trucks_id, 'Tractor Heads', 'tractor-heads'),
    (trucks_id, 'Tanker Trucks', 'tanker-trucks'),
    (trucks_id, 'Box Trucks', 'box-trucks'),
    (trucks_id, 'Container Chassis', 'container-chassis'),
    (trucks_id, 'Refrigerated Trucks', 'refrigerated-trucks'),
    (trucks_id, 'Car Carrier Trucks', 'car-carrier-trucks');

  -- Cranes & Lifting
  INSERT INTO subcategories (category_id, name, slug) VALUES
    (cranes_id, 'Mobile Cranes', 'mobile-cranes'),
    (cranes_id, 'Tower Cranes', 'tower-cranes'),
    (cranes_id, 'Crawler Cranes', 'crawler-cranes'),
    (cranes_id, 'Rough Terrain Cranes', 'rough-terrain-cranes'),
    (cranes_id, 'Forklifts', 'forklifts'),
    (cranes_id, 'Telehandlers', 'telehandlers'),
    (cranes_id, 'Boom Lifts', 'boom-lifts'),
    (cranes_id, 'Scissor Lifts', 'scissor-lifts'),
    (cranes_id, 'Gantry Cranes', 'gantry-cranes');

  -- Marine Equipment
  INSERT INTO subcategories (category_id, name, slug) VALUES
    (marine_id, 'Marine Engines', 'marine-engines'),
    (marine_id, 'Port Handling Equipment', 'port-handling-equipment'),
    (marine_id, 'Offshore Support Vessels', 'offshore-support-vessels'),
    (marine_id, 'Fishing Equipment', 'fishing-equipment');

  -- Oil & Gas
  INSERT INTO subcategories (category_id, name, slug) VALUES
    (oil_gas_id, 'Drilling Rigs', 'drilling-rigs'),
    (oil_gas_id, 'Pumps & Compressors', 'pumps-compressors'),
    (oil_gas_id, 'Pipeline Equipment', 'pipeline-equipment'),
    (oil_gas_id, 'Oilfield Trucks', 'oilfield-trucks'),
    (oil_gas_id, 'Storage Tanks', 'storage-tanks'),
    (oil_gas_id, 'Gas Processing Units', 'gas-processing-units'),
    (oil_gas_id, 'Safety Equipment', 'safety-equipment');

  -- Material Handling
  INSERT INTO subcategories (category_id, name, slug) VALUES
    (material_id, 'Forklifts', 'forklifts'),
    (material_id, 'Pallet Jacks', 'pallet-jacks'),
    (material_id, 'Reach Trucks', 'reach-trucks'),
    (material_id, 'Stackers', 'stackers'),
    (material_id, 'Warehouse Racking', 'warehouse-racking'),
    (material_id, 'Order Pickers', 'order-pickers'),
    (material_id, 'Dock Equipment', 'dock-equipment');

  -- Attachments & Parts
  INSERT INTO subcategories (category_id, name, slug) VALUES
    (attachments_id, 'Buckets', 'buckets'),
    (attachments_id, 'Hydraulic Hammers', 'hydraulic-hammers'),
    (attachments_id, 'Augers', 'augers'),
    (attachments_id, 'Grapples', 'grapples'),
    (attachments_id, 'Blades', 'blades'),
    (attachments_id, 'Quick Couplers', 'quick-couplers'),
    (attachments_id, 'Engines & Engine Parts', 'engines-engine-parts'),
    (attachments_id, 'Hydraulic Parts', 'hydraulic-parts'),
    (attachments_id, 'Undercarriage Parts', 'undercarriage-parts'),
    (attachments_id, 'Tires & Tracks', 'tires-tracks');
END $$;