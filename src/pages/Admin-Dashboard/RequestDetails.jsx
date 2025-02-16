import React from 'react';
import { 
  ArrowLeft, 
  User,
  Mail,
  Phone,
  CreditCard,
  Car,
  FileText,
  Calendar,
  Timer,
  CheckSquare,
  Repeat,
  CheckCircle,
  XCircle
} from 'lucide-react';


function RequestDetails({ request, onBack }) {
  if (!request) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#800000] via-gray-700 to-[#de9e28] mt-14">
      <div className="container mx-auto p-6">
        <button 
          onClick={onBack}
          className="flex items-center text-white mb-6 hover:text-[#de9e28] transition duration-300"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Requests
        </button>

        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-[#800000] to-[#de9e28] p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">{request.visitor_name}</h1>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                    {request.status?.charAt(0).toUpperCase() + request.status?.slice(1)}
                  </span>
                  <span className="text-white/80">Request #{request.id}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {request.is_regular_comer && (
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    Regular Visitor
                  </span>
                )}
                {request.consent && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    Policy Agreed
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-[#800000] mb-4">Personal Information</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-[#800000]" />
                    <div>
                      <p className="text-sm text-gray-600">Visitor Name</p>
                      <p className="font-medium">{request.visitor_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-[#800000]" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{request.visitor_email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-[#800000]" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">{request.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-[#800000]" />
                    <div>
                      <p className="text-sm text-gray-600">NIC</p>
                      <p className="font-medium">{request.nic}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vehicle Information */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-[#800000] mb-4">Vehicle Information</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Car className="h-5 w-5 text-[#800000]" />
                    <div>
                      <p className="text-sm text-gray-600">Vehicle Number</p>
                      <p className="font-medium">{request.vehicle_number}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Car className="h-5 w-5 text-[#800000]" />
                    <div>
                      <p className="text-sm text-gray-600">Vehicle Type</p>
                      <p className="font-medium">{request.vehicle_type}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visit Details */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-[#800000] mb-4">Visit Details</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-[#800000]" />
                    <div>
                      <p className="text-sm text-gray-600">Purpose</p>
                      <p className="font-medium">{request.purpose}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-[#800000]" />
                    <div>
                      <p className="text-sm text-gray-600">Meeting Person</p>
                      <p className="font-medium">{request.meeting_person}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-[#800000]" />
                    <div>
                      <p className="text-sm text-gray-600">Visit Date</p>
                      <p className="font-medium">{request.visit_date}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Timer className="h-5 w-5 text-[#800000]" />
                      <div>
                        <p className="text-sm text-gray-600">Entry Time</p>
                        <p className="font-medium">{request.entry_time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Timer className="h-5 w-5 text-[#800000]" />
                      <div>
                        <p className="text-sm text-gray-600">Exit Time</p>
                        <p className="font-medium">{request.exit_time}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status and Verification */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-[#800000] mb-4">Status & Verification</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    {request.status === 'approved' ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : request.status === 'rejected' ? (
                      <XCircle className="h-5 w-5 text-red-600" />
                    ) : (
                      <Timer className="h-5 w-5 text-yellow-600" />
                    )}
                    <div>
                      <p className="text-sm text-gray-600">Request Status</p>
                      <p className="font-medium capitalize">{request.status}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckSquare className={`h-5 w-5 ${request.consent ? 'text-green-600' : 'text-gray-400'}`} />
                    <div>
                      <p className="text-sm text-gray-600">Security Policy</p>
                      <p className="font-medium">{request.consent ? 'Agreed' : 'Not Agreed'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Repeat className={`h-5 w-5 ${request.is_regular_comer ? 'text-blue-600' : 'text-gray-400'}`} />
                    <div>
                      <p className="text-sm text-gray-600">Visitor Type</p>
                      <p className="font-medium">{request.is_regular_comer ? 'Regular Visitor' : 'One-time Visitor'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

{/* Supporting Documents */}
{request.supporting_documents && request.supporting_documents.data && (
  <div className="mt-8 bg-white rounded-lg p-6 shadow-sm">
    <h2 className="text-xl font-semibold text-[#800000] mb-4">Supporting Documents</h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Convert binary data to a Blob URL */}
      {(() => {
        const byteArray = request.supporting_documents.data.data;
        const mimeType = request.supporting_documents.contentType || 'application/octet-stream';

        // Create a Blob from the byte array
        const blob = new Blob([new Uint8Array(byteArray)], { type: mimeType });

        // Create a Blob URL
        const blobUrl = URL.createObjectURL(blob);

        return (
          <div className="relative group">
            {/* Display image or PDF */}
            {mimeType.startsWith('image/') ? (
              <img
                src={blobUrl}
                alt="Supporting Document"
                className="w-full h-48 object-cover rounded-lg"
              />
            ) : (
              <iframe
                src={blobUrl}
                title="Supporting Document"
                className="w-full h-48 rounded-lg"
              />
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
              <a
                href={blobUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white text-sm hover:underline"
              >
                View Full Size
              </a>
            </div>
          </div>
        );
      })()}
    </div>
  </div>
)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RequestDetails;