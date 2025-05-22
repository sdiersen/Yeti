import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormValues } from "../types/loginSchema";
import { DevTool } from "@hookform/devtools";
import Login from "./Login";

export function LoginProvider() {
  const methods = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "all",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  return (
    <FormProvider {...methods}>
      <Login />
      <DevTool control={methods.control} />
    </FormProvider>
  );
}
