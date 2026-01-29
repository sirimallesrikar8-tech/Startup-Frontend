import React from 'react';
import ConfirmDialog from '../../ui/ConfirmDialog';

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, vendorName }) => {
    return (
        <ConfirmDialog
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={onConfirm}
            title="Delete Vendor Account?"
            message={`Are you sure you want to delete ${vendorName}? all related data, service listings, and history will be permanently removed. This action cannot be undone.`}
            confirmText="Delete Vendor"
            variant="danger"
        />
    );
};

export default ConfirmDeleteModal;
