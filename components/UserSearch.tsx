"use client"

import { Doc } from "@/convex/_generated/dataModel"
import { searchUsers } from "@/convex/users";
import { useUserSearch } from "@/hooks/useUserSearch";
import { useUser } from "@clerk/nextjs";

function UserSearch({
    onSelectUser,
    placeholder = "Search users by name or email...",
    className,
}: {
    onSelectUser: (user: Doc<"users">) => void;
    placeholder?: string;
    className?: string;
}) {
    const { searchTerm, setSearchTerm, searchResults, isLoading } = 
    useUserSearch();

    const { user } = useUser();

    // Exclude the current user from search results
    const filteredResults = searchResults.filter(
        (searchUsers) => searchUsers._id !== user?.id 
    );

    const handleSelectUser = (user: (typeof searchResults)[0]) => {
        onSelectUser?.(user);
        setSearchTerm(""); // Clear search input after selection
    };

    const clearSearch = () => {
        setSearchTerm("");
    };
    



  return <div>UserSearch</div>;
}

export default UserSearch;
