import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  details: existingDetails,
  price: existingPrice,
  imageSrc: existingImages,
  category: assignedCategory,
  properties: assignedProperties,
}) {
  const router = useRouter();
  const [title, setTitle] = useState(existingTitle || "");
  const [category, setCategory] = useState(assignedCategory || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [price, setPrice] = useState(existingPrice || "");
  const [images, setImages] = useState(existingImages || []);
  const [uploadData, setUploadData] = useState();
  const [goToProducts, setGoToProducts] = useState(false);
  const [categories, setCategories] = useState([]);
  const [details, setDetails] = useState(existingDetails || "");
  const [productProperties, setProductProperties] = useState(assignedProperties || {});
  const [colors, setColors] = useState([
    { name: "", images: [null] },
  ]);  const [colorImages, setColorImages] = useState([]);


  const [sale, setSale] = useState(false);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [mainImageIndex, setMainImageIndex] = useState(0);

  useEffect(() => {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
      console.log("Categories loaded:", result.data);
    });
  }, []);

  function handleImageClick(index) {
    setMainImageIndex(index);
  }

  async function handleOnChange(changeEvent) {
    const files = changeEvent.target.files;

    const imagesArray = [];

    for (let i = 0; i < files.length; i++) {
      imagesArray.push(undefined);
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = (onLoadEvent) => {
        imagesArray[i] = onLoadEvent.target.result;

        if (imagesArray.filter((img) => img !== undefined).length === files.length) {
          const mainImage = imagesArray.splice(mainImageIndex, 1)[0];
          imagesArray.unshift(mainImage);

          setImages(imagesArray);
          setUploadData(undefined);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  
  

  async function SaveProduct() {
    const data = {
      title,
      description,
      details,
      price,
      category,
      images,
      sale,
      discountPercentage,
      properties: productProperties,
      colors: colors.map((color, index) => ({
        name: color.name,
        images: colorImages[index].map(image => image.secure_url), 
      })),
        };

    if (_id) {
      await axios.put("/api/products", { ...data, _id });
      console.log("Product updated:", data);
    } else {
      await axios.post("/api/products", data);
      console.log("Product created:", data);
    }

    setGoToProducts(true);
  }

  function setProductProp(propName, value) {
    setProductProperties((prev) => {
      const newProductProps = { ...prev };
      const combinedValues = newProductProps[propName] || [];
   
      // Si la valeur existe déjà dans la liste, la supprimer
      if (combinedValues.includes(value)) {
        newProductProps[propName] = combinedValues.filter(item => item !== value);
      } else {
        // Sinon, l'ajouter à la liste
        newProductProps[propName] = [...combinedValues, value];
      }
   
      return newProductProps;
    });
   }
   
   
   
  
  

  function handleColorNameChange(event, index) {
    const updatedColors = [...colors];
    updatedColors[index] = {
      ...updatedColors[index],
      name: event.target.value,
    };
    setColors(updatedColors);
    console.log("Color name changed:", event.target.value);
  }

  function addColorImage(index) {
    const newColorImages = [...colorImages];
    newColorImages[index] = newColorImages[index] ? [...newColorImages[index]] : [];
    newColorImages[index].push(null); 
    setColorImages(newColorImages);
  }
  
  function handleColorImageChange(event, colorIndex, imageIndex) {
    const files = event.target.files;
    if (files.length > 0) {
      const updatedColorImages = [...colorImages];
      updatedColorImages[colorIndex][imageIndex] = files[0];
      setColorImages(updatedColorImages);
    }
  }
  
  
  function addColor() {
    setColors([...colors, { name: "", images: [null] }]);
  }

  const propertiesToFill = [];
  if (categories.length > 0 && category) {
    let catInfo = categories.find(({ _id }) => _id === category);
    propertiesToFill.push(...catInfo.properties);
    while (catInfo?.parent?._id) {
      const parentCat = categories.find(({ _id }) => _id === catInfo?.parent?._id);
      propertiesToFill.push(...parentCat.properties);
      catInfo = parentCat;
    }
  }
  async function handleOnSubmit(event) {
    event.preventDefault();
    console.log("Form submitted");
  
    const form = event.currentTarget;
    const fileInput = Array.from(form.elements).find(({ name }) => name === "files");
  
    const uploadedProductImages = [];
  
    for (const file of fileInput.files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "my-uploads");
  
      const response = await fetch("https://api.cloudinary.com/v1_1/ddabwftgw/image/upload", {
        method: "POST",
        body: formData,
      });
  
      if (response.ok) {
        const data = await response.json();
        uploadedProductImages.push(data.secure_url);
      } else {
        console.error("Failed to upload product image");
        return;
      }
    }
  
    for (const [colorIndex, color] of colors.entries()) {
      if (color && colorImages[colorIndex]) {
        for (const [imageIndex, image] of colorImages[colorIndex].entries()) {
          if (image) {
            const formData = new FormData();
            formData.append("file", image);
            formData.append("upload_preset", "my-uploads");
    
            const response = await fetch("https://api.cloudinary.com/v1_1/ddabwftgw/image/upload", {
              method: "POST",
              body: formData,
            });
    
            if (response.ok) {
              const data = await response.json();
              colorImages[colorIndex][imageIndex] = data; 
            } else {
              console.error("Failed to upload color image");
            }
          } else {
            console.error("No image selected for color.");
          }
        }
      }
    }
    
    SaveProduct();
  }
  function handleDetails(event) {
    const value = event.target.value;
    setDetails(value.replace(/ /g, "-").replace(/%/g, "-"));
   }
   

  
  
  

  return (
    <form onSubmit={handleOnSubmit}>
      <h1>New Product</h1>
      <label>Product name</label>
      <input
        type="text"
        placeholder="product name"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <label>Category</label>
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">uncategorized</option>
        {categories.length > 0 &&
          categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.parent ? `${c.parent.name} - ` : ""} {c.name}
            </option>
          ))}
      </select>

      {propertiesToFill.length > 0 &&
        propertiesToFill.map((p,index) => (
          <div key={`${p.name}-${index}`} >
            <label>{p.name[0].toUpperCase() + p.name.substring(1)}</label>
            <div>
              <select
                multiple={true}
                value={productProperties[p.name]}
                onChange={(ev) =>
                  setProductProp(
                    p.name,
                    Array.from(ev.target.selectedOptions, (option) => option.value)
                    )
                }
              >
                {p.values.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}

      <label>Description</label>
      <textarea
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <label>Details</label>
      <textarea
        type="text"
        placeholder="Details"
        value={details}
         onChange={(e) => handleDetails(e)}
      />

      <label>Photos</label>
      <p>
        <input type="file" name="files" multiple onChange={handleOnChange} />
      </p>

      {images.length > 0 &&
        images.map((img, index) => (
          <img
            key={index}
            src={img}
            onClick={() => handleImageClick(index)}
            className={index === mainImageIndex ? "main-image" : ""}
          />
        ))}
      {uploadData && (
        <code>
          <pre>{JSON.stringify(uploadData, null, 2)}</pre>
        </code>
      )}

      <label>Price</label>
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <label>Sale</label>
      <input
        type="checkbox"
        checked={sale}
        onChange={(ev) => setSale(ev.target.checked)}
      />

      {sale && (
        <div>
          <label>Discount Percentage</label>
          <input
            type="number"
            value={discountPercentage}
            onChange={(ev) => setDiscountPercentage(ev.target.value)}
          />
        </div>
      )}

      
      <label>Colors</label>
      {colors.map((color, colorIndex) => (
  <div key={`${color.name}-${colorIndex}`}>
  <label>Color Name</label>
  <input
    type="text"
    value={color.name}
    onChange={(e) => handleColorNameChange(e, colorIndex)}
  />
  {colorImages[colorIndex] && colorImages[colorIndex].map((image, imageIndex) => (
    <div key={`${color.name}-${colorIndex}-image-${imageIndex}`}>
      <label>Color Image {imageIndex + 1}</label>
      <input
        type="file"
        multiple={false} 
        onChange={(e) => handleColorImageChange(e, colorIndex, imageIndex)}
      />
    </div>
  ))}
  <button type="button" onClick={() => addColorImage(colorIndex)}>
    Add Image
  </button>
</div>

))}
      <button type="button" onClick={addColor}>
        Add Color
      </button>
      <button type="submit" className="btn btn-primary rounded-lg p-2 px-4">
        Save
      </button>
    </form>
  );
}
