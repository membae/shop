import { useContext, useState } from 'react';
import { AppContext } from '../../AppContextProvider';
import { FaTimes } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import config from '../../../config';

const AddProduct = () => {
  const {taxCategories,categories,setProducts,products}=useContext(AppContext)
  const {api}=config
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [features, setFeatures] = useState([]);
  const [newFeature, setNewFeature] = useState("");
  const [taxCategory, setTaxCategory] = useState(null);
  const [purchasePriceExclTax, setPurchasePriceExclTax] = useState("");
  const [purchasePriceInclTax, setPurchasePriceInclTax] = useState("");
  const [sellingPriceExclTax, setSellingPriceExclTax] = useState("");
  const [sellingPriceInclTax, setSellingPriceInclTax] = useState("");
  const [openingStock, setOpeningStock] = useState(0);
  const [taxMultiplier,setTaxMultiplier]=useState(null)

  const navigate=useNavigate()
  // Handler for adding a new feature
  const addFeature = () => {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature]);
      setNewFeature("");
    }
  };

  //submit product function
  function addProductFn(e){
    e.preventDefault()
    let formData=new FormData() //create a new formdata and append images to the formdata
    for(let i=0;i<images.length;i++){
      formData.append('file',images[i].file)
    }
    const productData={
        "name":productName,
        "category_id":category,
        "description":description,
        "features":features,
        "purchase_price":purchasePriceInclTax,
        "selling_price":sellingPriceInclTax,
        "quantity":openingStock,
        "tax_id":taxCategory
    }
    formData.append("product_data",JSON.stringify(productData)) //appends the product data as json format so we have a single fetch
    Swal.fire({
  title: `Add ${productName}?`,
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Proceed',
  cancelButtonText: 'Cancel',
  allowOutsideClick: false, // Prevent closing while loading
  allowEscapeKey: false,   // Prevent closing with Escape key
}).then((result) => {
  if (result.isConfirmed) {
    // Show loading spinner
    Swal.fire({
      title: 'Processing...',
      text: 'Please wait while we add the product.',
      icon: 'info',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
        
        // Perform the fetch
        fetch(`${api}/products`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("access_Token")}`,
          },
          body: formData,
        })
          .then((res) => {
            if (res.ok) {
              return res.json().then((data) => {
                setProducts([...products, data]);
                Swal.fire({
                  title: "Success!",
                  text: "Product added successfully.",
                  icon: "success",
                  confirmButtonText: "OK",
                }).then((result) => {
                  if (result.isConfirmed) {
                    navigate('/admin/products');
                  }
                });
              });
            }else{
              return res.json().then(data=>{
                Swal.fire({
                  title:"Failed!",
                  text:`${data.msg} Try again later.`,
                  icon:'warning',
                  confirmButtonText: "OK"
              })
              })
            }
          })
        }})
  }})}
  //function to handle adding adding an image 
   // Handle file selection and preview
   const handleImages = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to an array
    const newImages = files.map((file) => {
      const url = URL.createObjectURL(file); // Create a preview URL
      return { file, url };
    });
    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  // Remove an image from the preview list
  const removeImage = (url) => {
    setImages(images.filter((image) => image.url !== url));
  };
  //function to handle changes in price and tax category together with its assist functions
  function handlePriceTax(value1,constant){
    function purchasePriceExclTaxFn(){
      if(taxCategory==='' || !taxCategory){
        setPurchasePriceInclTax(value1)
      }else{
        let taxMultiplier1=1+taxMultiplier/100
        let price=(value1*taxMultiplier1).toFixed(2)
        setPurchasePriceInclTax(parseFloat(price))
      }
    }
    function purchasePriceInclTaxFn(){
      if(taxCategory==="" || !taxCategory){
        setPurchasePriceExclTax(value1)
      }else{
        let taxMultiplier1=1+taxMultiplier/100
        let price=(value1/taxMultiplier1).toFixed(2)
        setPurchasePriceExclTax(parseFloat(price))
      }
    }
    function sellingPriceExclTaxFn(){
      if(taxCategory==='' || !taxCategory){
        setSellingPriceInclTax(value1)
      }else{
        let taxMultiplier1=1+taxMultiplier/100
        let price=(value1*taxMultiplier1).toFixed(2)
        setSellingPriceInclTax(parseFloat(price))
      }
    }
    function selingPriceInclTaxFn(){
      if(taxCategory==="" || !taxCategory){
        setSellingPriceExclTax(value1)
      }else{
        let taxMultiplier1=1+taxMultiplier/100
        let price=(value1/taxMultiplier1).toFixed(2)
        setSellingPriceExclTax(parseFloat(price))
      }
    }
    function taxCategoryFn(x){
      if(x!=="null" && purchasePriceExclTax!==""){
        let taxMultiplier1=1+x/100
        let price=(purchasePriceExclTax*taxMultiplier1).toFixed(2)
        let price1=(sellingPriceExclTax*taxMultiplier1).toFixed(2)
        setPurchasePriceInclTax(parseFloat(price))
        sellingPriceExclTax!==""?setSellingPriceInclTax(price1):setSellingPriceInclTax(sellingPriceExclTax)
      }else{
        setPurchasePriceInclTax(purchasePriceExclTax)
        setSellingPriceInclTax(sellingPriceExclTax)
      }
    }
    if(constant==="purchasePriceExclTax"){
      setPurchasePriceExclTax(value1)
      purchasePriceExclTaxFn()
    }
    if(constant==="purchasePriceInclTax"){
      setPurchasePriceInclTax(value1)
      purchasePriceInclTaxFn()
    }
    if(constant==="taxCategory"){
      setTaxCategory(value1)
      if(value1===""){setTaxMultiplier(null);taxCategoryFn("null")}
      else{
      const taxArr=taxCategories.filter((item)=>{if( item.id===parseInt(value1)){return item}})[0]
      setTaxMultiplier(taxArr.value);taxCategoryFn(taxArr.value)}
    }
    if(constant==="sellingPriceExclTax" ){
      setSellingPriceExclTax(value1)
      sellingPriceExclTaxFn()
    }
    if(constant==="sellingPriceInclTax"){
      setSellingPriceInclTax(value1)
      selingPriceInclTaxFn()
    }
  }
  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
      <form onSubmit={addProductFn}>
      {/* Product Name and Category */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <label className="block font-semibold mb-2">Product Name</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="Enter product name"
            required
          />
        </div>
        <div className="flex-1">
  <label className="block font-semibold mb-2">Select Category</label>
  <div className="flex items-center space-x-2">
    <select
      value={category}
      onChange={(e) => setCategory(e.target.value)}
      className="w-full p-2 border rounded-md"
      required
    >
      <option value="">Choose a category</option>
      {categories.map((category)=>{
        return (<option key={category.id} value={category.id}>{category.name}</option>)
      })}
      
    </select>
  </div>
</div>

      </div>

      {/* Description and Image Upload */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <label className="block font-semibold mb-2">Product Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded-md h-24"
            placeholder="Enter product description"
            required
          ></textarea>
        </div>
        <div className="flex-1">
          <label className="block font-semibold mb-2">Product Image</label>
          <input
            type="file"
            multiple // Allow multiple file selection
            onChange={handleImages} // Handle onChange event
            className="w-full p-2 border rounded-md"
          />
          <div className="mt-4">
            {images.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {images.map((image, index) => (
                  <div key={index} className="relative w-32 h-32">
                    <img
                      src={image.url}
                      alt="preview"
                      className="w-full h-full object-cover rounded-md"
                    />
                    <button
                      onClick={() => removeImage(image.url)}
                      className="absolute top-0 right-0 p-1 bg-gray-500 text-white rounded-full"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mb-6 flex gap-4">
        <section className='w-1/2'>
        <label className="block font-semibold mb-2">Features</label>
        <div className="flex items-center gap-4 mb-2 ">
          <input
            type="text"
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="Add a feature"
          />
          <button
          type='button'
            onClick={addFeature}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Add
          </button>
        </div>
        </section>
        <ul className="space-y-2 mt-2">
          {features.map((feature, index) => (
            <li key={index} className="text-sm text-gray-700">
              - {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* Pricing Section */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">Pricing</label>
        <div className="flex gap-4 mb-2">
          <div className="flex-1">
            <label className="block font-semibold mb-2">Tax Category</label>
            <select
              value={taxCategory}
              onChange={(e) => handlePriceTax(e.target.value,"taxCategory")}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select tax category</option>
              {taxCategories.map((tax)=>{
                return (
                  <option key={tax.id} value={tax.id}>{tax.name}</option>
                )
              })}
            </select>
          </div>
          <div className="flex-1">
            <label className="block font-semibold mb-2">Purchase Price (Excl. Tax)</label>
            <input
              type="number"
              value={purchasePriceExclTax}
              onChange={(e) => handlePriceTax(e.target.value,"purchasePriceExclTax")}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div className="flex-1">
            <label className="block font-semibold mb-2">Purchase Price (Incl. Tax)</label>
            <input
              type="number"
              value={purchasePriceInclTax}
              onChange={(e) => handlePriceTax(e.target.value,"purchasePriceInclTax")}
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-semibold mb-2">Selling Price (Excl. Tax)</label>
            <input
              type="number"
              value={sellingPriceExclTax}
              onChange={(e) => handlePriceTax(e.target.value,"sellingPriceExclTax")}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div className="flex-1">
            <label className="block font-semibold mb-2">Selling Price (Incl. Tax)</label>
            <input
              type="number"
              value={sellingPriceInclTax}
              onChange={(e) => handlePriceTax(e.target.value,"sellingPriceInclTax")}
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>
      </div>

      {/* Opening Stock */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">Opening Stock</label>
        <input
          type="number"
          value={openingStock}
          onChange={(e) => setOpeningStock(e.target.value)}
          className="w-full p-2 border rounded-md"
          placeholder="Enter opening stock quantity"
        />
      </div>

      {/* Save/Add Product Button */}
      <button
        type='submit'
        className="bg-green-500 text-white px-6 py-2 rounded-md w-full"
      >
        Save / Add Product
      </button>
      </form>
    </div>
  );
};

export default AddProduct;
