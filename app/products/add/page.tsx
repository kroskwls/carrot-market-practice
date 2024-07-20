"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { uploadProduct } from "./actions";
import { useFormState } from "react-dom";

export default function AddProduct() {
  const [state, dispatch] = useFormState(uploadProduct, null);
  const [preview, setPreview] = useState("");
  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (!files) {
      return;
    }

    const file = files[0];
    const fileUrl = URL.createObjectURL(file);
    setPreview(fileUrl);
  };

  return (
    <div>
      <form className="flex flex-col gap-5 p-5" action={dispatch}>
        <label
          className="border-2 aspect-square flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer bg-center bg-cover"
          htmlFor="photo"
          style={{
            backgroundImage: `url(${preview})`
          }}
        >
          {preview === "" ? (
            <>
              <PhotoIcon className="w-20" />
              <div className="text-neutral-400 text-sm">
                Add photo
                {state?.fieldErrors.photo}
              </div>
            </>
          ) : null}
        </label>
        <input className="hidden" type="file" id="photo" name="photo" onChange={onImageChange} />
        <Input
          type="text"
          name="title"
          placeholder="Title"
          required
          errors={state?.fieldErrors.title}
        />
        <Input
          type="number"
          name="price"
          placeholder="Price"
          required
          errors={state?.fieldErrors.price}
        />
        <Input
          type="text"
          name="description"
          placeholder="Description"
          required
          errors={state?.fieldErrors.description}
        />
        <Button text="Upload" />
      </form>
    </div>
  );
}