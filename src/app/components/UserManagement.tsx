import React, { useState } from "react";
import {
  Users,
  Search,
  X,
  User,
  Award,
  TrendingUp,
  FileText,
  Clock,
  CheckCircle,
  BarChart3,
} from "lucide-react";
import { Select } from "antd";
import Image from "next/image";

interface TestResult {
  testName: string;
  score: number;
  date: string;
  duration: string;
  status: string;
}

interface User {
  id: string;
  name: string;
  displayName?: string;
  email: string;
  status?: "active" | "inactive";
  joinDate: string;
  completedTests: number;
  totalTests: number;
  avgScore: number;
  createdAt?: any;
  testResults?: TestResult[];
  photoURL?: string;
}

interface UserManagementProps {
  users: User[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  loading: boolean;
  filteredUsers: User[];
  selectedUser: User | null;
  setSelectedUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const UserManagement: React.FC<UserManagementProps> = ({
  users,
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  filteredUsers,
  selectedUser,
  setSelectedUser,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };
  
  const formatDate = (date: any) => {
    if (!date) return "Unknown";
    try {
      const jsDate = new Date(date);
      return jsDate.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return "Invalid Date";
    }
  };

  return (
    <div className="relative">
      <div className={isModalOpen ? "blur-sm" : ""}>
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              User Management
            </h1>
            <p className="text-slate-600">
              View and manage user accounts and test results
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-slate-900">
                  Total Users: {users.length}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex items-center space-x-4">
            <div className="relative w-full">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-10 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  ×
                </button>
              )}
            </div>
            <Select
              value={filterStatus}
              onChange={(value) => setFilterStatus(value)}
              className="w-48"
              options={[
                { value: "all", label: "All Statuses" },
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
              ]}
            />
          </div>

          {/* Users Table */}
          <div className="p-6">
            <div className="max-h-96 overflow-y-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-100 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Join Date
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Avg. Score
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {filteredUsers?.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="transition-all duration-200 hover:bg-slate-50"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {user.photoURL ? (
                                <Image
                                  src={user.photoURL}
                                  alt={user.name || "User"}
                                  width={40}
                                  height={40}
                                  className="rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-lg">
                                  {user?.name?.charAt(0) || "?"}
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-slate-900">
                                {user.name || "N/A"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                          {user.email}
                        </td>

                        {/* Join Date */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                          {formatDate(user.joinDate)}
                        </td>

                        {/* Avg Score */}
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-slate-600">
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">
                            {user.avgScore}%
                          </span>
                        </td>

                        {/* Action */}
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                          <button
                            onClick={() => handleViewDetails(user)}
                            className="text-white bg-blue-600 hover:bg-blue-700 font-medium px-4 py-2 rounded-lg transition-colors shadow-md"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center text-slate-500 py-10"
                      >
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-xl p-6 shadow-2xl relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5 cursor-pointer" />
            </button>

            {/* Modal Content */}
            <div className="bg-white rounded-xl p-6">
              {/* Header */}
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg mb-3">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">
                    {selectedUser.name}
                  </h2>
                  <p className="text-sm text-slate-500">{selectedUser.email}</p>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
                  <div className="p-2 bg-blue-100 rounded-full mb-1">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    Total Tests
                  </p>
                  <p className="text-lg font-bold text-slate-900">
                    {selectedUser.totalTests}
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
                  <div className="p-2 bg-green-100 rounded-full mb-1">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    Completed
                  </p>
                  <p className="text-lg font-bold text-slate-900">
                    {selectedUser.completedTests}
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
                  <div className="p-2 bg-yellow-100 rounded-full mb-1">
                    <Award className="w-5 h-5 text-yellow-600" />
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    Avg. Score
                  </p>
                  <p className="text-lg font-bold text-slate-900">
                    {selectedUser.avgScore}%
                  </p>
                </div>
              </div>

              {/* Test Results */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  Test Results
                </h3>
                {selectedUser.testResults &&
                selectedUser.testResults.length > 0 ? (
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {selectedUser.testResults.map((result, index) => (
                      <div
                        key={index}
                        className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center hover:bg-slate-100 transition"
                      >
                        <div className="flex-1 mb-2 md:mb-0">
                          <p className="text-base font-semibold text-slate-900">
                            {result.testName}
                          </p>
                          <p className="text-xs text-slate-500">
                            Date: {formatDate(result.date)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1 text-slate-600 text-sm">
                            <TrendingUp className="w-4 h-4 text-green-600" />
                            <span>
                              Score:{" "}
                              <span className="font-semibold text-slate-900">
                                {result.score}%
                              </span>
                            </span>
                          </div>
                          <div className="flex items-center space-x-1 text-slate-600 text-sm">
                            <Clock className="w-4 h-4 text-slate-400" />
                            <span>{result.duration}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-8 bg-slate-50 rounded-xl border border-slate-200">
                    <BarChart3 className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                    <p className="text-slate-500 text-sm">
                      No tests completed yet.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;