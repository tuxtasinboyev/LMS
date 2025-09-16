import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

const API_BASE_URL = "http://18.199.221.227:1709"

export const useProfiles = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          throw new Error("Token topilmadi")
        }

        const response = await axios.get(`${API_BASE_URL}/profiles/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        console.log("Profile API response:", response.data)
        return response.data.data || response.data
      } catch (error) {
        console.error("Profile fetch error:", error.response?.data || error.message)
        throw error
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutga cache qilsin
    retry: 2, // xatolik bo'lsa ikki marta qayta urinadi
    refetchOnWindowFocus: false,
    enabled: !!localStorage.getItem("token"), // token bo'lsa fetch qilsin
  })
}

export const useCategory = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/course-category/getAll`)
        console.log("Categories response:", response.data)
        return response.data.data || response.data
      } catch (error) {
        console.error("Categories fetch error:", error)
        throw error
      }
    },
    staleTime: 1000 * 60 * 10, // 10 minutga cache qilsin
    retry: 1,
  })
}

export const useAddCourse = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (courseData) => {
      try {
        const formData = new FormData()

        // Add all course fields to FormData
        formData.append("name", courseData.name || "")
        formData.append("about", courseData.about || "")
        formData.append("price", courseData.price?.toString() || "0")
        formData.append("level", courseData.level || "BEGINNER")
        formData.append("published", courseData.published?.toString() || "false")
        formData.append("categoryId", courseData.categoryId?.toString() || "")

        // Add mentorId if provided
        if (courseData.mentorId) {
          formData.append("mentorId", courseData.mentorId.toString())
        }

        // Add banner file if provided
        if (courseData.banner && courseData.banner instanceof File) {
          formData.append("banner", courseData.banner)
        }

        const token = localStorage.getItem("token")
        if (!token) {
          throw new Error("Token topilmadi")
        }

        const response = await axios.post(`${API_BASE_URL}/courses`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        })

        console.log("Course created:", response.data)
        return response.data.data || response.data
      } catch (error) {
        console.error("Course creation error:", error.response?.data || error.message)
        throw error
      }
    },
    onSuccess: () => {
      // Invalidate and refetch courses data
      queryClient.invalidateQueries({ queryKey: ["courses"] })
    },
  })
}

export const useUpdateCourse = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data: courseData }) => {
      try {
        const formData = new FormData()

        // Add all course fields to FormData
        formData.append("name", courseData.name || "")
        formData.append("about", courseData.about || "")
        formData.append("price", courseData.price?.toString() || "0")
        formData.append("level", courseData.level || "BEGINNER")
        formData.append("published", courseData.published?.toString() || "false")
        formData.append("categoryId", courseData.categoryId?.toString() || "")

        // Add mentorId if provided
        if (courseData.mentorId) {
          formData.append("mentorId", courseData.mentorId.toString())
        }

        // Add banner file if provided
        if (courseData.banner && courseData.banner instanceof File) {
          formData.append("banner", courseData.banner)
        }

        const token = localStorage.getItem("token")
        if (!token) {
          throw new Error("Token topilmadi")
        }

        const response = await axios.put(`${API_BASE_URL}/courses/${id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        })

        console.log("Course updated:", response.data)
        return response.data.data || response.data
      } catch (error) {
        console.error("Course update error:", error.response?.data || error.message)
        throw error
      }
    },
    onSuccess: () => {
      // Invalidate and refetch courses data
      queryClient.invalidateQueries({ queryKey: ["courses"] })
    },
  })
}

// Hook for deleting a course
export const useDeleteCourse = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (courseId) => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          throw new Error("Token topilmadi")
        }

        const response = await axios.delete(`${API_BASE_URL}/courses/${courseId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        console.log("Course deleted:", response.data)
        return response.data.data || response.data
      } catch (error) {
        console.error("Course deletion error:", error.response?.data || error.message)
        throw error
      }
    },
    onSuccess: () => {
      // Invalidate and refetch courses data
      queryClient.invalidateQueries({ queryKey: ["courses"] })
    },
  })
}
