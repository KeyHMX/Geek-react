import { http } from "@/utils";

export function loginAPI (formData) {
    return http({
      url: '/authorizations',
      method: 'POST',
      data: formData
    })
  }