const TeacherDashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Teacher Dashboard</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">My Classes</h3>
          <div className="space-y-3">
            <div className="p-3 border rounded hover:bg-gray-50 cursor-pointer">
              <h4 className="font-medium">Class 5A - Starters</h4>
              <p className="text-sm text-gray-600">24 students</p>
            </div>
            <div className="p-3 border rounded hover:bg-gray-50 cursor-pointer">
              <h4 className="font-medium">Class 6B - Movers</h4>
              <p className="text-sm text-gray-600">18 students</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="p-3 border rounded">
              <p className="text-sm">John completed Starters Test #2</p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
            <div className="p-3 border rounded">
              <p className="text-sm">Sarah submitted Movers assignment</p>
              <p className="text-xs text-gray-500">4 hours ago</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
        <div className="flex space-x-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Assign Test
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            View Reports
          </button>
          <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
            Manage Students
          </button>
        </div>
      </div>
    </div>
  )
}

export default TeacherDashboard