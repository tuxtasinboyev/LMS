"use client"

import React, { useState, createContext, useContext, useEffect } from "react"
import * as XLSX from "xlsx"
import { Search, Filter, Plus, ChevronLeft, ChevronRight, Moon, Sun } from "lucide-react"
import { useActiveIndexStore } from "../../store/UserStores"
import axios from "axios"

const DarkModeContext = createContext()

function DarkModeProvider({ children }) {
    const [isDark, setIsDark] = useState(false)
    return (
        <DarkModeContext.Provider value={{ isDark, setIsDark }}>
            <div className={isDark ? "dark" : ""}>{children}</div>
        </DarkModeContext.Provider>
    )
}

function useDarkMode() {
    const context = useContext(DarkModeContext)
    if (!context) throw new Error("useDarkMode must be used within DarkModeProvider")
    return context
}

function MentorCategory() {
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const { isDark, setIsDark } = useDarkMode()
    const itemsPerPage = 5
    const { activeIndex, currentView, setActiveIndex, setCurrentView } = useActiveIndexStore();

    // const categories = [
    //     { id: 1, name: "Backend" },
    //     { id: 2, name: "Frontend" },
    //     { id: 3, name: "Foundation" },
    //     { id: 4, name: "Mobil" },
    //     { id: 5, name: "IT Matematik" },
    //     { id: 6, name: "Buxgalteriya" },
    //     { id: 7, name: "Buxgalteriya" },
    //     { id: 8, name: "Buxgalteriya" },
    //     { id: 9, name: "Buxgalteriya" },
    //     { id: 10, name: "Buxgalteriya" },
    //     { id: 11, name: "Buxgalteriya" },
    // ]
    const [categories, setCategories] = useState([])
    const fetchCategories = async () => {
        const response = await axios('http://18.199.221.227:1709/course-category/getAll')

        setCategories(response.data)
    }
    useEffect(() => {

        fetchCategories()
    }, [])

    const handleSearch = (e) => {
        setSearchTerm(e.target.value.toLowerCase())
        setCurrentPage(1)
    }

    const filteredCategories = categories.filter((category) =>
        category.name.toLowerCase().includes(searchTerm)
    )

    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedCategories = filteredCategories.slice(startIndex, startIndex + itemsPerPage)

    const downloadExcel = () => {
        const ws = XLSX.utils.json_to_sheet(
            filteredCategories.map((cat, idx) => ({
                TR: idx + 1,
                Kategoriya: cat.name,
            }))
        )
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "Kategoriyalar")
        XLSX.writeFile(wb, "kategoriyalar.xlsx")
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300 p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-700 to-purple-600 dark:from-cyan-400 dark:to-pink-500 bg-clip-text text-transparent">
                    Kategoriyalar
                </h1>
                <button
                    onClick={() => setIsDark(!isDark)}
                    className="p-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                >
                    {isDark ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-600" />}
                </button>
            </div>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-8">
                <span onClick={() => setCurrentView(0)} className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">
                    Foydalanuvchilar
                </span>
                <ChevronRight className="w-4 h-4" />
                <span className="font-semibold text-gray-900 dark:text-gray-200">Kategoriyalar</span>
            </div>

            {/* Search & Button */}
            <div className="flex items-center gap-4 mb-8">
                <div className="flex-1 relative">
                    <input
                        type="text"
                        placeholder="Kategoriyalarni qidiring..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-full pl-5 pr-12 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 shadow-lg transition-all"
                    />
                    <Filter className="absolute right-4 top-4 w-6 h-6 text-gray-400 dark:text-gray-500" />
                </div>
                <button
                    onClick={downloadExcel}
                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all flex items-center gap-3 shadow-lg hover:shadow-xl font-semibold"
                >
                    <Search className="w-5 h-5" />
                    Excel Yuklab Olish
                </button>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                        <tr>
                            <th className="px-8 py-5 text-left text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">TR</th>
                            <th className="px-8 py-5 text-left text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Kategoriya</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {paginatedCategories.length > 0 ? (
                            paginatedCategories.map((category, idx) => (
                                <tr key={category.id} className="hover:bg-purple-50 dark:hover:bg-purple-800 transition-all duration-200">
                                    <td className="px-8 py-6 text-sm font-semibold text-gray-600 dark:text-gray-400">{startIndex + idx + 1}</td>
                                    <td className="px-8 py-6 text-sm font-medium text-gray-800 dark:text-gray-200">{category.name}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={2} className="px-8 py-12 text-center text-gray-500 dark:text-gray-400 font-medium">
                                    Hech qanday kategoriya topilmadi.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-8">
                <div className="flex items-center gap-6">
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Sahifada: {itemsPerPage}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">{startIndex + 1}-{Math.min(filteredCategories.length, startIndex + itemsPerPage)} dan {filteredCategories.length}</div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        </button>
                        <button
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function MentorCategoryWithProvider() {
    return (
        <DarkModeProvider>
            <MentorCategory />
        </DarkModeProvider>
    )
}
