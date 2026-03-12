import {
  Users,
  Activity,
  CheckCircle2,
  Database
} from 'lucide-react';

export function Dashboard() {
  const stats = [
    {
      label: 'Conversations',
      value: '15',
      trend: '+1 this week',
      icon: Activity,
      className: 'bg-gradient-to-br from-[#4ea39d] to-[#4338ca] text-white'
    },
    {
      label: 'Active Protocols',
      value: '39',
      icon: Activity,
      className: 'bg-black text-white'
    },
    {
      label: 'My Patients',
      value: '7',
      icon: Users,
      className: 'bg-gradient-to-br from-[#f59e0b] to-[#ea580c] text-white'
    },
    {
      label: 'Airtable Companions',
      value: '8',
      icon: Database,
      className: 'bg-[#5b9bb5] text-white relative overflow-hidden',
      mesh: true
    }
  ];

  const recentActivity = [
    { id: 1, action: 'Sent message To Patient', user: 'abhilasha4042@gmail.com', time: 'about 19 hours ago' },
    { id: 2, action: 'Sent message To Patient', user: 'abhilasha4042@gmail.com', time: 'about 20 hours ago' },
    { id: 3, action: 'Sent message To Patient', user: 'abhilasha4042@gmail.com', time: 'about 21 hours ago' }
  ];

  const recentPatients = [
    { id: 1, name: 'anshul', time: '1 day ago' },
    { id: 2, name: 'Charlie Singh', time: '1 day ago' },
    { id: 3, name: 'anshul', time: '1 day ago' }
  ];

  return (
    <div className="space-y-10">
      {/* Welcome Section */}
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-bold text-black tracking-tight">Welcome, abhilasha</h1>
        <p className="text-lg font-medium text-black/80">Here's your clinic overview</p>

        <button className="mt-8 w-fit px-5 py-2.5 bg-black text-white rounded-lg font-semibold text-sm transition-transform hover:scale-[1.02] active:scale-[0.98]">
          Add Protocol
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`relative min-h-[180px] p-8 rounded-[24px] ${stat.className} transition-transform hover:scale-[1.02] cursor-default group shadow-sm`}
          >
            {stat.mesh && (
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.2),transparent)] opacity-50" />
            )}
            
            <div className="flex flex-col h-full justify-between relative z-10">
              <div className="flex justify-between items-start">
                 <span className="text-lg font-bold opacity-90">{stat.label}</span>
                 <stat.icon size={22} className="opacity-80" />
              </div>
              
              <div className="mt-auto space-y-1">
                <span className="text-5xl font-bold tracking-tight block">{stat.value}</span>
                {stat.trend && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-white/10 text-[10px] font-bold backdrop-blur-sm">
                    <Activity size={10} className="mr-1" />
                    {stat.trend}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Grid for detailed info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Conversation Quality */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm">
          <h3 className="text-xl font-bold mb-6 text-black">Conversation Quality</h3>
          <div className="space-y-6 text-sm font-semibold">
            {[
              { label: 'Grade A', value: 1, percent: 100 },
              { label: 'Grade B', value: 0, percent: 0 },
              { label: 'Grade C', value: 0, percent: 0 },
              { label: 'Grade D', value: 0, percent: 0 },
            ].map((grade) => (
              <div key={grade.label} className="space-y-2">
                <div className="flex justify-between items-center text-black/60">
                  <span>{grade.label}</span>
                  <span>{grade.value} ({grade.percent}%)</span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-black rounded-full" 
                    style={{ width: `${grade.percent}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm">
           <h3 className="text-xl font-bold mb-6 text-black">Recent Activity</h3>
           <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex gap-4 p-4 rounded-2xl border border-gray-100 transition-colors hover:bg-gray-50 group">
                  <div className="h-11 w-11 flex-shrink-0 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                    <CheckCircle2 size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-black truncate">{activity.action}</p>
                    <p className="text-xs text-black/50 font-medium truncate">{activity.user}</p>
                    <p className="text-[11px] text-black/40 font-bold mt-1 flex items-center gap-1">
                       <Activity size={10} />
                       {activity.time}
                    </p>
                  </div>
                </div>
              ))}
           </div>
        </div>

        {/* Recent Patients */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm">
           <h3 className="text-xl font-bold mb-6 text-black">Recent Patients</h3>
           <div className="space-y-4">
              {recentPatients.map((patient) => (
                <div key={patient.id} className="flex gap-4 p-4 rounded-2xl border border-gray-100 transition-colors hover:bg-gray-50 group">
                  <div className="h-11 w-11 flex-shrink-0 bg-gray-100 text-black/50 rounded-full flex items-center justify-center">
                    <Users size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-black">{patient.name}</p>
                    <p className="text-[11px] text-black/40 font-bold mt-0.5">{patient.time}</p>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}