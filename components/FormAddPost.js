"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

const FormAddPost = ({ boardId }) => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLoading) return;

    setIsLoading(true);

    try {
      const data = await axios.post(`/api/post?boarId=${boardId}`, {
        title,
        description,
      });
      setTitle("");
      setDescription("");

      toast.success("Board created successfully");
      router.refresh();
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Something went wrong. Please try again.";

      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className="bg-base-100 p-8 rounded-3xl space-y-8"
      onSubmit={handleSubmit}
    >
      <p className="font-bold text-lg">Suggest a feature</p>
      <label className="form-control w-full">
        <span className="lable-text">Short, descriptive title</span>
        <input
          required
          type="text"
          className="input input-bordered w-full"
          placeholder="GHreen buttons plz"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          maxLength={100}
        />
      </label>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Description</legend>
        <textarea
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          className="textarea h-24"
          placeholder="The login button color should be green to match our brand colors."
          maxLength={1000}
        ></textarea>
      </fieldset>
      <button className="btn btn-primary w-full" type="submit">
        {isLoading && (
          <span className="loading loading-spinner loading-xs"></span>
        )}
        Add Post
      </button>
    </form>
  );
};
export default FormAddPost;
