const fs = require('fs');
const path = require('path');

const productsFile = path.join(__dirname, '..', 'data', 'products.json');

const rawData = `ICU Bed Mechanical|KEF01|999|Mechanical ICU bed with adjustable back, knee and trendelenburg positions.|9027
Hospital Fowler Bed ABS Panels|KEF02|1000|Fowler hospital bed with ABS panels and adjustable sections.|9028
Hospital Fowler Bed Sunmica Panels|KEF03|1001|Hospital bed with sunmica panels and adjustable positions.|9029
Hospital Fowler Bed Semi Deluxe|KEF04|1002|Semi deluxe fowler bed with perforated sheet top.|9030
Hospital Semi Fowler Bed ABS Panels|KEF05|1003|Semi fowler bed with ABS head and foot panels.|9031
Hospital Plain Bed Semi Deluxe|KEF06|1004|Plain hospital bed with durable powder coated frame.|9032
Hospital Semi Fowler Bed|KEF07|1005|Adjustable semi fowler bed for patient comfort.|9033
Baby Cradle on Stand|KEF08|1006|Detachable baby cradle on powder coated stand.|9034
Crash Cart Trolley|KEF09|1007|Emergency trolley for hospital use.|9035
Gynae Examination Table|KEF10|1008|Gynecological examination table with adjustable head section.|9036
Examination Couch|KEF11|1009|Comfortable examination couch with drawers and cabinets.|9037
Examination Table Plain|KEF12|1010|Standard examination table with adjustable head rest.|9038
Stretcher Trolley|KEF13|1011|Mobile stretcher trolley with castor wheels.|9039
Instrument Trolley|KEF14|1012|SS instrument trolley with shelves.|9040
Dressing Trolley|KEF15|1013|Hospital dressing trolley with bowl and bucket.|9041
Over Bed Table Fixed Height|KEF16|1014|Fixed height bedside table for patients.|9042
Medicine Trolley with Four Drawers|KEF17|1015|Medicine storage trolley with drawers and shelves.|9043
Over Bed Table Manual|KEF18|1016|Manual over-bed table with laminated top.|9044
Over Bed Table Mayo Type|KEF19|1017|Height adjustable mayo type over-bed table.|9045
Bed Side Locker|KEF20|1018|Hospital bedside locker with cupboard.|9046
Bed Side Locker Deluxe|KEF21|1019|Deluxe bedside locker with storage compartments.|9047
Bed Side Screen|KEF22|1020|Privacy screen available in 3 or 4 panels.|9048
Foot Step Double|KEF23|1021|Double step stool with anti-slip rubber mat.|9049
Foot Step Single|KEF24|1022|Single step stool with rubber matting.|9050
Revolving Stool SS 4 Leg|KEF25|1023|Stainless steel revolving stool.|9051
Patient Stool Revolving SS Top|KEF26|1024|Patient stool with revolving SS top.|9052
3 Leg Revolving Stool|KEF27|1025|Three leg revolving stool for clinics.|9053
Patient Visitor Stool|KEF28|1026|Visitor stool for hospitals and clinics.|9054
Patient Revolving Stool Cushioned|KEF29|1027|Cushioned revolving stool for comfort.|9055
Folding Stretcher Double Fold|KEF30|1028|Portable double-fold stretcher.|9056
Folding Stretcher 4 Fold|KEF31|1029|Compact four-fold stretcher for transport.|9057
Folding Stretcher Canvas|KEF32|1030|Canvas stretcher for emergency use.|9058
Oxygen Trolley Jumbo|KEF33|1031|Heavy duty oxygen cylinder trolley.|9059
Oxygen Trolley SS|KEF34|1032|Stainless steel oxygen trolley.|9060
Cylinder Trolley|KEF35|1033|Cylinder transport trolley.|9061
Two Section Mattress|KEF36|1034|Mattress for semi-fowler beds.|9062
Wash Basin Stand Single|KEF37|1035|Single bowl wash basin stand.|9063
Wash Basin Stand Double|KEF38|1036|Double bowl wash basin stand.|9064
IV Stand|KEF39|1037|Adjustable IV stand with castor base.|9065
Wheel Chair Folding|KEF40|1038|Foldable wheelchair for patient mobility.|9066
Rainbow Commode|KEF41|1039|Portable commode chair.|9067
Square Cut Commode|KEF42|1040|Square cut commode for patient support.|9068
Commode Stool|KEF43|1041|Compact commode stool.|9069
Commode Chair With Half Back|KEF44|1042|Commode chair with half-back support.|9070
Commode Chair|KEF45|1043|Standard commode chair.|9071
Commode Chair With Armrest|KEF46|1044|Commode chair with armrests.|9072
Crutches|KEF47|1045|Adjustable walking crutches.|9073
Walking Stick|KEF48|1046|Lightweight walking aid stick.|9074
Quadripod Walking Stick|KEF49|1047|Four-leg walking stick for stability.|9075
Elbow Crutch|KEF50|1048|Forearm support crutch.|9076
Fixed Walker|KEF51|1049|Fixed frame walking walker.|9077
Folding Walker|KEF52|1050|Foldable walking walker.|9078
Nutbolt Walker|KEF53|1051|Walker with nut-bolt construction.|9079
Back Rest|KEF54|1052|Supportive back rest for patients.|9080
Back Rest with Cloth|KEF55|1053|Cloth supported adjustable back rest.|9081`;

const newProducts = rawData.split('\n').map(line => {
  const [title, sku, price, description, hsn] = line.split('|');
  return {
    id: `prod-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title: title,
    description: description,
    price: parseInt(price),
    originalPrice: Math.round(parseInt(price) * 1.2),
    rating: 0,
    reviews: 0,
    icon: 'ShieldCheck',
    tag: 'NEW',
    discount: null,
    stock: 100,
    product_status: 'active',
    edited_by_admin: false,
    category: 'HOSPITAL FURNITURE',
    hsnCode: hsn,
    sku: sku,
    brand: 'Khush Enterprises',
    imageUrl: null
  };
});

try {
  let existingProducts = [];
  if (fs.existsSync(productsFile)) {
    const data = fs.readFileSync(productsFile, 'utf8');
    existingProducts = JSON.parse(data);
  }
  
  // check if already added
  const existingSkus = new Set(existingProducts.map(p => p.sku));
  const productsToAdd = newProducts.filter(p => !existingSkus.has(p.sku));
  
  const finalProducts = [...existingProducts, ...productsToAdd];
  fs.writeFileSync(productsFile, JSON.stringify(finalProducts, null, 2));
  console.log(`Added ${productsToAdd.length} products successfully.`);
} catch (error) {
  console.error("Error updating products file:", error);
}
