
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { MdSearch } from 'react-icons/md';

interface SearchableDropdownProps<T> {
    items: T[];
    displayKey: keyof T;
    valueKey: keyof T;
    placeholder?: string;
    onSelect: (value: string) => void;
    selectedItemValue: string;
    label: string;
    error?: string;
    renderItem?: (item: T) => React.ReactNode;
}

function SearchableDropdown<T>({
                                   items,
                                   displayKey,
                                   valueKey,
                                   placeholder,
                                   onSelect,
                                   selectedItemValue,
                                   label,
                                   error,
                                   renderItem,
                               }: SearchableDropdownProps<T>) {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedItem = useMemo(() => {
        return items.find(item => String(item[valueKey]) === selectedItemValue);
    }, [items, valueKey, selectedItemValue]);

    useEffect(() => {
        if (selectedItem) {
            setSearchTerm(String(selectedItem[displayKey]));
        } else {
            setSearchTerm('');
        }
    }, [selectedItem, displayKey]);


    const filteredItems = useMemo(() => {
        if (!searchTerm) {
            return items;
        }
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return items.filter(item =>
            String(item[displayKey]).toLowerCase().includes(lowerCaseSearchTerm) ||
            (item as any).author?.toLowerCase().includes(lowerCaseSearchTerm) ||
            (item as any).isbn?.toLowerCase().includes(lowerCaseSearchTerm) ||
            (item as any).email?.toLowerCase().includes(lowerCaseSearchTerm)
        );
    }, [items, searchTerm, displayKey]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setIsOpen(true);
        onSelect('');
    };

    const handleInputFocus = () => {
        setIsOpen(true);
    };

    const handleItemClick = (item: T) => {
        setSearchTerm(String(item[displayKey]));
        onSelect(String(item[valueKey]));
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <label htmlFor={`${label}-search`} className='block text-sm font-medium text-gray-700 mb-1'>
                {label}
            </label>
            <div className="relative">
                <input
                    type="text"
                    id={`${label}-search`}
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        error ? "border-red-300" : "border-gray-300"
                    }`}
                    autoComplete="off" // Prevent browser autocomplete
                />
                <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>

            {isOpen && filteredItems.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-80 overflow-y-auto">
                    {filteredItems.map((item, index) => (
                        <li
                            key={String(item[valueKey]) || index} // Use valueKey for unique key, fallback to index
                            className="px-4 py-2 cursor-pointer hover:bg-indigo-100 text-gray-900 text-sm"
                            onClick={() => handleItemClick(item)}
                        >
                            {renderItem ? renderItem(item) : String(item[displayKey])}
                        </li>
                    ))}
                </ul>
            )}

            {error && <p className='mt-1 text-sm text-red-600'>{error}</p>}
        </div>
    );
}

export default SearchableDropdown;
