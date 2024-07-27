"use client";

import { useTypesense } from "@/providers/typesenseProvider";
import {
  Button,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Field,
  Fieldset,
  Input,
  Label,
  Legend,
  Switch,
} from "@headlessui/react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

const NodeSchema = z.object({
  name: z.string().min(2, { message: "Host is required" }),
  type: z.string().min(2, { message: "Port is required" }),
  facet: z.boolean(),
});

const LoginFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  fields: z.array(NodeSchema).min(1, { message: "Field is required" }),
  default_sorting_field: z.string().optional(),
});

type LoginFormInputs = z.infer<typeof LoginFormSchema>;

export function AddCollection() {
  const typesense = useTypesense();

  let [isOpen, setIsOpen] = useState(false);

  const {
    register,
    control,
    getValues,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(LoginFormSchema),
    mode: "onBlur",
    values: {
      name: "",
      fields: [
        {
          name: ".*",
          type: "auto",
          facet: false,
        },
      ],
    },
  });

  const { fields, append, update, remove } = useFieldArray({
    control,
    name: "fields",
  });

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        reset();
      }, 500);
    }
  }, [isOpen, reset]);

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      await typesense?.client?.collections().create(data as any);

      setIsOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Button className="flex gap-2" onClick={() => setIsOpen(true)}>
        <PlusIcon className="h-5 w-5" />
        <span>Create collection</span>
      </Button>
      <Dialog open={isOpen} onClose={setIsOpen} className="relative z-50">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white dark:bg-[#1E293B] text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div className="px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <DialogTitle className="font-bold mb-2">
                  Create collection
                </DialogTitle>
                <hr />
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="mt-2 space-y-6"
                >
                  <div className="space-y-6">
                    <Field>
                      <Label
                        htmlFor="name"
                        className="block text-sm font-medium leading-6"
                      >
                        Name
                      </Label>
                      <Input
                        id="name"
                        invalid={!!errors.name}
                        placeholder="Enter name"
                        className="w-full"
                        {...register("name")}
                      />
                    </Field>

                    <Fieldset className="space-y-1">
                      <Legend className="text-lg font-bold flex justify-between">
                        Fields
                        <Button
                          onClick={() => {
                            append({
                              name: ".*",
                              type: "auto",
                              facet: false,
                            });
                          }}
                        >
                          <PlusIcon className="h-5 w-5" />
                        </Button>
                      </Legend>
                      {fields.map((field, index) => (
                        <div key={field.id} className="">
                          <Field>
                            <Label className="block">Name</Label>
                            <Input
                              className="mt-1 block"
                              {...register(`fields.${index}.name`)}
                            />
                          </Field>
                          <Field>
                            <Label className="block">Type</Label>
                            <Input
                              className="mt-1 block"
                              {...register(`fields.${index}.type`)}
                            />
                          </Field>
                          <Switch
                            checked={getValues(`fields.${index}.facet`)}
                            onChange={(value) => {
                              update(index, {
                                ...getValues(`fields.${index}`),
                                facet: value,
                              });
                            }}
                            className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition data-[checked]:bg-blue-600"
                          >
                            <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6" />
                          </Switch>

                          <Button
                            onClick={() => {
                              remove(index);
                            }}
                          >
                            <TrashIcon className="h-5 w-5" />
                          </Button>
                        </div>
                      ))}
                    </Fieldset>
                  </div>
                  <div className="flex justify-end gap-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting || !isDirty || !isValid}
                      className="rounded bg-primary py-2 px-4 text-sm text-white data-[hover]:bg-primary-dark"
                    >
                      Save changes
                    </Button>
                  </div>
                </form>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}
