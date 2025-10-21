const StudentDashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Available Tests</h3>
          <div className="space-y-3">
            <div className="p-3 border rounded hover:bg-gray-50 cursor-pointer">
              <h4 className="font-medium">Starters Practice Test</h4>
              <p className="text-sm text-gray-600">Beginner level assessment</p>
            </div>
            <div className="p-3 border rounded hover:bg-gray-50 cursor-pointer">
              <h4 className="font-medium">Movers Practice Test</h4>
              <p className="text-sm text-gray-600">Intermediate level assessment</p>
            </div>
            <div className="p-3 border rounded hover:bg-gray-50 cursor-pointer">
              <h4 className="font-medium">Flyers Practice Test</h4>
              <p className="text-sm text-gray-600">Advanced level assessment</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Recent Results</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 border rounded">
              <span>Starters Test #1</span>
              <span className="text-green-600 font-medium">85%</span>
            </div>
            <div className="flex justify-between items-center p-3 border rounded">
              <span>Movers Test #1</span>
              <span className="text-yellow-600 font-medium">72%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard