// Re-export from slot.api.js for consistency
// All vendor slot APIs are consolidated in slot.api.js
export {
  createVendorSlot,
  saveVendorSlot,
  getVendorSlots,
  editVendorSlot,
  deleteVendorSlot
} from "./slot.api";

// Legacy exports with different names for backward compatibility
export { getVendorSlots as getAvailableVendorSlots } from "./slot.api";
