"use client"

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { SearchIcon } from "lucide-react";
import { FormEventHandler, useState } from "react";
import { useRouter } from "next/navigation";

const Search = () => {
    const router = useRouter();
    const [search, setSearch] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const handleSearchSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        if (!search) return;
        router.push(`/restaurants?search=${search}`);
    }

    return (
        <form className="flex gap-4" onSubmit={handleSearchSubmit}>
            <Input 
                placeholder="Buscar restaurantes"
                className="border-none"
                onChange={handleChange}
                value={search}
            />
            <Button size="icon" type="submit">
                <SearchIcon size={16} />
            </Button>
        </form>
    );
}
 
export default Search;