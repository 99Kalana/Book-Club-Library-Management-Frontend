
import React from "react";

interface DialogProps {
    isOpen: boolean;
    onCancel: () => void;
    onConfirm: () => void;
    children: React.ReactNode;
    title?: string;
}

const Dialog: React.FC<DialogProps> = ({ isOpen, onCancel, onConfirm, children, title }) => {
    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-inter p-4'>
            <div className='bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl max-h-[95vh] flex flex-col'>
                {title && (
                    <div className='mb-4 flex-shrink-0'>
                        <h2 className='text-xl font-semibold text-gray-800'>{title}</h2>
                    </div>
                )}

                <div className='mb-6 flex-1 overflow-y-auto max-h-[calc(95vh-80px)] min-h-0'>{children}</div>
                <div className='flex justify-end space-x-4 flex-shrink-0'>
                    <button
                        onClick={onCancel}
                        className='px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition duration-150 shadow-sm'
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-150 shadow-sm'
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dialog;
