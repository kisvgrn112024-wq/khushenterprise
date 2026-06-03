const fs = require('fs');
const path = require('path');

const csvData = `ICU Bed Mechanical|KEF01|HOSPITAL FURNITURE|999|Mechanical ICU bed with adjustable back, knee and trendelenburg positions.|9027|
Hospital Fowler Bed ABS Panels|KEF02|HOSPITAL FURNITURE|1000|Fowler hospital bed with ABS panels and adjustable sections.|9028|
Hospital Fowler Bed Sunmica Panels|KEF03|HOSPITAL FURNITURE|1001|Hospital bed with sunmica panels and adjustable positions.|9029|
Hospital Fowler Bed Semi Deluxe|KEF04|HOSPITAL FURNITURE|1002|Semi deluxe fowler bed with perforated sheet top.|9030|
Hospital Semi Fowler Bed ABS Panels|KEF05|HOSPITAL FURNITURE|1003|Semi fowler bed with ABS head and foot panels.|9031|
Hospital Plain Bed Semi Deluxe|KEF06|HOSPITAL FURNITURE|1004|Plain hospital bed with durable powder coated frame.|9032|
Hospital Semi Fowler Bed|KEF07|HOSPITAL FURNITURE|1005|Adjustable semi fowler bed for patient comfort.|9033|
Baby Cradle on Stand|KEF08|HOSPITAL FURNITURE|1006|Detachable baby cradle on powder coated stand.|9034|
Crash Cart Trolley|KEF09|HOSPITAL FURNITURE|1007|Emergency trolley for hospital use.|9035|
Gynae Examination Table|KEF10|HOSPITAL FURNITURE|1008|Gynecological examination table with adjustable head section.|9036|
Examination Couch|KEF11|HOSPITAL FURNITURE|1009|Comfortable examination couch with drawers and cabinets.|9037|
Examination Table Plain|KEF12|HOSPITAL FURNITURE|1010|Standard examination table with adjustable head rest.|9038|
Stretcher Trolley|KEF13|HOSPITAL FURNITURE|1011|Mobile stretcher trolley with castor wheels.|9039|
Instrument Trolley|KEF14|HOSPITAL FURNITURE|1012|SS instrument trolley with shelves.|9040|
Dressing Trolley|KEF15|HOSPITAL FURNITURE|1013|Hospital dressing trolley with bowl and bucket.|9041|
Over Bed Table Fixed Height|KEF16|HOSPITAL FURNITURE|1014|Fixed height bedside table for patients.|9042|
Medicine Trolley with Four Drawers|KEF17|HOSPITAL FURNITURE|1015|Medicine storage trolley with drawers and shelves.|9043|
Over Bed Table Manual|KEF18|HOSPITAL FURNITURE|1016|Manual over-bed table with laminated top.|9044|
Over Bed Table Mayo Type|KEF19|HOSPITAL FURNITURE|1017|Height adjustable mayo type over-bed table.|9045|
Bed Side Locker|KEF20|HOSPITAL FURNITURE|1018|Hospital bedside locker with cupboard.|9046|
Bed Side Locker Deluxe|KEF21|HOSPITAL FURNITURE|1019|Deluxe bedside locker with storage compartments.|9047|
Bed Side Screen|KEF22|HOSPITAL FURNITURE|1020|Privacy screen available in 3 or 4 panels.|9048|
Foot Step Double|KEF23|HOSPITAL FURNITURE|1021|Double step stool with anti-slip rubber mat.|9049|
Foot Step Single|KEF24|HOSPITAL FURNITURE|1022|Single step stool with rubber matting.|9050|
Revolving Stool SS 4 Leg|KEF25|HOSPITAL FURNITURE|1023|Stainless steel revolving stool.|9051|
Patient Stool Revolving SS Top|KEF26|HOSPITAL FURNITURE|1024|Patient stool with revolving SS top.|9052|
3 Leg Revolving Stool|KEF27|HOSPITAL FURNITURE|1025|Three leg revolving stool for clinics.|9053|
Patient Visitor Stool|KEF28|HOSPITAL FURNITURE|1026|Visitor stool for hospitals and clinics.|9054|
Patient Revolving Stool Cushioned|KEF29|HOSPITAL FURNITURE|1027|Cushioned revolving stool for comfort.|9055|
Folding Stretcher Double Fold|KEF30|HOSPITAL FURNITURE|1028|Portable double-fold stretcher.|9056|
Folding Stretcher 4 Fold|KEF31|HOSPITAL FURNITURE|1029|Compact four-fold stretcher for transport.|9057|
Folding Stretcher Canvas|KEF32|HOSPITAL FURNITURE|1030|Canvas stretcher for emergency use.|9058|
Oxygen Trolley Jumbo|KEF33|HOSPITAL FURNITURE|1031|Heavy duty oxygen cylinder trolley.|9059|
Oxygen Trolley SS|KEF34|HOSPITAL FURNITURE|1032|Stainless steel oxygen trolley.|9060|
Cylinder Trolley|KEF35|HOSPITAL FURNITURE|1033|Cylinder transport trolley.|9061|
Two Section Mattress|KEF36|HOSPITAL FURNITURE|1034|Mattress for semi-fowler beds.|9062|
Wash Basin Stand Single|KEF37|HOSPITAL FURNITURE|1035|Single bowl wash basin stand.|9063|
Wash Basin Stand Double|KEF38|HOSPITAL FURNITURE|1036|Double bowl wash basin stand.|9064|
IV Stand|KEF39|HOSPITAL FURNITURE|1037|Adjustable IV stand with castor base.|9065|
Wheel Chair Folding|KEF40|HOSPITAL FURNITURE|1038|Foldable wheelchair for patient mobility.|9066|
Rainbow Commode|KEF41|HOSPITAL FURNITURE|1039|Portable commode chair.|9067|
Square Cut Commode|KEF42|HOSPITAL FURNITURE|1040|Square cut commode for patient support.|9068|
Commode Stool|KEF43|HOSPITAL FURNITURE|1041|Compact commode stool.|9069|
Commode Chair With Half Back|KEF44|HOSPITAL FURNITURE|1042|Commode chair with half-back support.|9070|
Commode Chair|KEF45|HOSPITAL FURNITURE|1043|Standard commode chair.|9071|
Commode Chair With Armrest|KEF46|HOSPITAL FURNITURE|1044|Commode chair with armrests.|9072|
Crutches|KEF47|HOSPITAL FURNITURE|1045|Adjustable walking crutches.|9073|
Walking Stick|KEF48|HOSPITAL FURNITURE|1046|Lightweight walking aid stick.|9074|
Quadripod Walking Stick|KEF49|HOSPITAL FURNITURE|1047|Four-leg walking stick for stability.|9075|
Elbow Crutch|KEF50|HOSPITAL FURNITURE|1048|Forearm support crutch.|9076|
Fixed Walker|KEF51|HOSPITAL FURNITURE|1049|Fixed frame walking walker.|9077|
Folding Walker|KEF52|HOSPITAL FURNITURE|1050|Foldable walking walker.|9078|
Nutbolt Walker|KEF53|HOSPITAL FURNITURE|1051|Walker with nut-bolt construction.|9079|
Back Rest|KEF54|HOSPITAL FURNITURE|1052|Supportive back rest for patients.|9080|
Back Rest with Cloth|KEF55|HOSPITAL FURNITURE|1053|Cloth supported adjustable back rest.|9081|`;

const rows = csvData.trim().split('\n');

const newProducts = rows.map(row => {
  const [name, sku, category, price, description, hsnCode, image] = row.split('|');
  
  return {
    id: `hf_${sku.toLowerCase()}`,
    title: name,
    description: description,
    price: parseInt(price),
    originalPrice: parseInt(price) + Math.floor(parseInt(price) * 0.15), // fake 15% discount for UI
    rating: 4.5,
    reviews: Math.floor(Math.random() * 50) + 10,
    icon: "ShieldCheck", // fallback icon
    tag: "NEW",
    discount: "15% OFF",
    stock: 100,
    product_status: "active",
    edited_by_admin: false,
    category: category,
    hsnCode: hsnCode,
    sku: sku,
    brand: "Khush Enterprises",
    imageUrl: image ? image : ""
  };
});

const jsonPath = path.join(__dirname, 'backend', 'data', 'products.json');
let existing = [];
if (fs.existsSync(jsonPath)) {
  existing = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
}

// Check duplicates by SKU
const existingSkus = new Set(existing.map(p => p.sku));
let added = 0;
for (const p of newProducts) {
  if (!existingSkus.has(p.sku)) {
    existing.push(p);
    added++;
  }
}

fs.writeFileSync(jsonPath, JSON.stringify(existing, null, 2));
console.log(`Successfully added ${added} new Hospital Furniture products to products.json`);
