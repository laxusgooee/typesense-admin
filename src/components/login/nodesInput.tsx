'use client';

import { Controller} from "react-hook-form";
import { Input } from "./input";
import { v4  } from 'uuid';
import { TrashIcon } from '@heroicons/react/24/solid';

type NodesInputProps = {
    control: any;
    onRemoveNode: (index: number) => void;
}

export function NodesInput({
    control,
    onRemoveNode,
}: NodesInputProps) {

    return (
        <div>
            <Controller
                control={control}
                name="nodes"
                render={({ field }) => {
                    return (
                        <div>
                            {field.value.map((_: unknown, index: number) => (
                                <div key={v4()} className="grid grid-cols-5 gap-2">
                                    <div className="col-span-5 md:col-span-3">
                                        <Input
                                            control={control}
                                            name={`nodes.${index}.host`}
                                            placeholder="Enter Host"
                                        />
                                    </div>
                                    <div className="flex gap-2 items-center col-span-5 md:col-span-2">
                                        <Input
                                            control={control}
                                            name={`nodes.${index}.port`}
                                            placeholder="Enter Port"
                                        />
                                        <Input
                                            control={control}
                                            name={`nodes.${index}.protocol`}
                                            placeholder="Enter Protocol"
                                        />
                                        <button type="button" className="pt-2 text-red-500 hover:text-red-700" onClick={() => onRemoveNode(index)}>
                                            <TrashIcon aria-hidden="true" className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}                   
                        </div>
                    );
                }}
            />
        </div>
    );
}