import { useEffect, useState } from "react";
import { getVendorsByStatus } from "../services/vendor.api";

export default function useVendors(status, refresh) {
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    getVendorsByStatus(status)
      .then(res => setVendors(res.data))
      .catch(err => console.error(err));
  }, [status, refresh]);

  return vendors;
}
