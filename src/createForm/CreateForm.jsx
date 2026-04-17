import { useContext } from "react";
import { JwtContext } from "../jwt-context";
import styles from "./CreateForm.module.css";
import { Form } from "react-router-dom";

const CreateForm = () => {
  const jwt = useContext(JwtContext);

  return (
    <Form method="PoST">
      <h1>Create New Article</h1>
    </Form>
  );
};

export { CreateForm };
