const AdminDashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-2xl font-bold text-blue-600">1,247</h3>
          <p className="text-gray-600">Total Students</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-2xl font-bold text-green-600">89</h3>
          <p className="text-gray-600">Active Teachers</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-2xl font-bold text-purple-600">156</h3>
          <p className="text-gray-600">Tests Completed Today</p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">System Management</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 border rounded hover:bg-gray-50">
              Manage Users
            </button>
            <button className="w-full text-left p-3 border rounded hover:bg-gray-50">
              Content Management
            </button>
            <button className="w-full text-left p-3 border rounded hover:bg-gray-50">
              System Settings
            </button>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Reports & Analytics</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 border rounded hover:bg-gray-50">
              Usage Statistics
            </button>
            <button className="w-full text-left p-3 border rounded hover:bg-gray-50">
              Performance Reports
            </button>
            <button className="w-full text-left p-3 border rounded hover:bg-gray-50">
              Export Data
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard