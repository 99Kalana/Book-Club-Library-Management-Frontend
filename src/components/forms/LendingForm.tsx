// src/components/forms/LendingForm.tsx

import React, { useState, useEffect } from "react";
import { MdBook, MdPerson, MdSwapHoriz, MdVisibility, MdVisibilityOff } from "react-icons/md"; // Added more icons
import type { LendingFormData } from "../../types/LendingTransaction";
import type { Book } from "../../types/Book";
import type { Reader } from "../../types/Reader";
import { getAllBooks } from "../../services/bookService";
import { getAllReaders } from "../../services/readerService";
import axios from "axios";
import toast from "react-hot-toast";
import SearchableDropdown from "../lendingform/SearchableDropdown"; // Corrected import path for SearchableDropdown

interface LendingFormProps {
    onSubmit: (lendingData: LendingFormData) => void;
}

interface FormErrors {
    bookId?: string;
    readerId?: string;
}

const LendingForm: React.FC<LendingFormProps> = ({ onSubmit }) => {
    const [formData, setFormData] = useState<LendingFormData>({
        bookId: "",
        readerId: "",
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [allBooks, setAllBooks] = useState<Book[]>([]);
    const [allReaders, setAllReaders] = useState<Reader[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [showFormPreview, setShowFormPreview] = useState(false);

    // State to hold the selected book and reader objects for preview
    const [selectedBookObj, setSelectedBookObj] = useState<Book | null>(null);
    const [selectedReaderObj, setSelectedReaderObj] = useState<Reader | null>(null);

    // Fetch all books and readers for dropdowns
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const fetchedBooks = await getAllBooks();
                const fetchedReaders = await getAllReaders();
                setAllBooks(fetchedBooks.filter(book => book.availableCopies > 0)); // Only show available books
                setAllReaders(fetchedReaders);

                // Pre-select first available book and reader if they exist
                if (fetchedBooks.length > 0) {
                    setFormData(prev => ({ ...prev, bookId: fetchedBooks[0]._id }));
                    setSelectedBookObj(fetchedBooks[0]);
                }
                if (fetchedReaders.length > 0) {
                    setFormData(prev => ({ ...prev, readerId: fetchedReaders[0]._id }));
                    setSelectedReaderObj(fetchedReaders[0]);
                }

            } catch (error) {
                if (axios.isAxiosError(error)) {
                    toast.error(error.response?.data?.message || "Failed to load data for lending form.");
                } else {
                    toast.error("An unexpected error occurred while fetching books/readers.");
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // Update selected book/reader objects when formData.bookId or formData.readerId changes
    useEffect(() => {
        setSelectedBookObj(allBooks.find(book => book._id === formData.bookId) || null);
    }, [formData.bookId, allBooks]);

    useEffect(() => {
        setSelectedReaderObj(allReaders.find(reader => reader._id === formData.readerId) || null);
    }, [formData.readerId, allReaders]);


    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        if (!formData.bookId) {
            newErrors.bookId = "Please select a book";
        }
        if (!formData.readerId) {
            newErrors.readerId = "Please select a reader";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit({
                bookId: formData.bookId,
                readerId: formData.readerId,
            });
        }
    };

    const handleBookSelect = (bookId: string) => {
        setFormData(prev => ({ ...prev, bookId }));
        setErrors(prev => ({ ...prev, bookId: undefined })); // Clear error on select
    };

    const handleReaderSelect = (readerId: string) => {
        setFormData(prev => ({ ...prev, readerId }));
        setErrors(prev => ({ ...prev, readerId: undefined })); // Clear error on select
    };

    const handleReset = () => {
        setFormData({
            bookId: allBooks.length > 0 ? allBooks[0]._id : "",
            readerId: allReaders.length > 0 ? allReaders[0]._id : "",
        });
        setErrors({});
    };

    if (isLoading) {
        return <div className="text-center py-4 text-gray-600">Loading books and readers...</div>;
    }

    if (allBooks.length === 0 || allReaders.length === 0) {
        return (
            <div className="text-center py-4 text-red-600">
                No available books or registered readers to create a lending transaction.
                Please add books and readers first.
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            {/* Form Header */}
            <div className="mb-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <MdSwapHoriz className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Lend New Book
                </h2>
                <p className="text-gray-600">
                    Select a book and a reader to create a new lending transaction
                </p>
            </div>

            {/* Form Preview Toggle */}
            <div className="mb-6 flex justify-center">
                <button
                    type="button"
                    onClick={() => setShowFormPreview(!showFormPreview)}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors duration-200"
                >
                    {showFormPreview ? <MdVisibilityOff className="w-4 h-4" /> : <MdVisibility className="w-4 h-4" />}
                    <span>{showFormPreview ? 'Hide Preview' : 'Show Preview'}</span>
                </button>
            </div>

            {/* Form Preview Card */}
            {showFormPreview && (
                <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-indigo-200 shadow-inner">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <MdVisibility className="w-5 h-5 mr-2 text-indigo-500" />
                        Lending Preview
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <p className="font-medium text-gray-900 flex items-center space-x-2">
                                <MdBook className="w-5 h-5 text-blue-500" />
                                <span>{selectedBookObj?.title || 'No Book Selected'}</span>
                            </p>
                            <p className="text-sm text-gray-500 ml-7">{selectedBookObj?.author || 'N/A'}</p>
                            <p className="text-sm text-gray-500 ml-7">Available: {selectedBookObj?.availableCopies ?? 'N/A'}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="font-medium text-gray-900 flex items-center space-x-2">
                                <MdPerson className="w-5 h-5 text-purple-500" />
                                <span>{selectedReaderObj?.name || 'No Reader Selected'}</span>
                            </p>
                            <p className="text-sm text-gray-500 ml-7">{selectedReaderObj?.email || 'N/A'}</p>
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className='space-y-6'>
                {/* Book Selection with SearchableDropdown */}
                <div>
                    <SearchableDropdown<Book>
                        label="Select Book"
                        items={allBooks}
                        displayKey="title"
                        valueKey="_id"
                        placeholder="Search by title, author, or ISBN..."
                        onSelect={handleBookSelect}
                        selectedItemValue={formData.bookId}
                        error={errors.bookId}
                        renderItem={(book) => (
                            <span>
                {book.title} by {book.author} (Available: {book.availableCopies})
              </span>
                        )}
                    />
                </div>

                {/* Reader Selection with SearchableDropdown */}
                <div>
                    <SearchableDropdown<Reader>
                        label="Select Reader"
                        items={allReaders}
                        displayKey="name"
                        valueKey="_id"
                        placeholder="Search by name or email..."
                        onSelect={handleReaderSelect}
                        selectedItemValue={formData.readerId}
                        error={errors.readerId}
                        renderItem={(reader) => (
                            <span>
                {reader.name} ({reader.email})
              </span>
                        )}
                    />
                </div>

                {/* Form Actions */}
                <div className="pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-end space-x-3">
                        <button
                            type="button"
                            onClick={handleReset}
                            className="px-6 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                        >
                            Reset
                        </button>
                        <button
                            type='submit'
                            className='px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                        >
                            Lend Book
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default LendingForm;
