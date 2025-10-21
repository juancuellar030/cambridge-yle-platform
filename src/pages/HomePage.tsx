import { Link } from 'react-router-dom'

const HomePage = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        Welcome to Cambridge YLE Testing Platform
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        A comprehensive digital platform for Cambridge Young Learners English assessments.
        Practice, learn, and track progress in a fun and engaging environment.
      </p>
      
      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3 text-blue-600">For Students</h3>
          <p className="text-gray-600 mb-4">Take practice tests and track your progress</p>
          <Link 
            to="/student" 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Student Portal
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3 text-green-600">For Teachers</h3>
          <p className="text-gray-600 mb-4">Manage classes and monitor student progress</p>
          <Link 
            to="/teacher" 
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Teacher Portal
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3 text-purple-600">For Administrators</h3>
          <p className="text-gray-600 mb-4">Manage platform settings and content</p>
          <Link 
            to="/admin" 
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Admin Portal
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HomePage