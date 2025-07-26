
import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Area,
    AreaChart,
    ReferenceLine
} from 'recharts';
import { MdTrendingUp, MdBarChart, MdShowChart } from 'react-icons/md';


interface MonthlyLendingData {
    month: string;
    lent: number;
    returned: number;
}

interface DashboardChartsProps {
    monthlyLendingData: MonthlyLendingData[];
}


const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-gray-200">
                <p className="text-sm font-semibold text-gray-900 mb-2">{`${label}`}</p>
                {payload.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center space-x-2 mb-1">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: entry.color }}
                        ></div>
                        <span className="text-sm text-gray-600">{entry.name}:</span>
                        <span className="text-sm font-medium text-gray-900">{entry.value}</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};


const CustomLegend = ({ payload }: any) => {
    return (
        <div className="flex justify-center space-x-6 mt-4">
            {payload.map((entry: any, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                    <div
                        className="w-3 h-3 rounded-full shadow-sm"
                        style={{ backgroundColor: entry.color }}
                    ></div>
                    <span className="text-sm font-medium text-gray-700">{entry.value}</span>
                </div>
            ))}
        </div>
    );
};

const DashboardCharts: React.FC<DashboardChartsProps> = ({ monthlyLendingData }) => {

    const totalLent = monthlyLendingData.reduce((sum, data) => sum + data.lent, 0);
    const totalReturned = monthlyLendingData.reduce((sum, data) => sum + data.returned, 0);
    const netBalance = totalLent - totalReturned;


    const cumulativeData = monthlyLendingData.map((item, index) => {
        const previousData = monthlyLendingData.slice(0, index);
        const cumulativeLent = previousData.reduce((sum, prev) => sum + prev.lent, 0) + item.lent;
        const cumulativeReturned = previousData.reduce((sum, prev) => sum + prev.returned, 0) + item.returned;

        return {
            ...item,
            cumulativeLent,
            cumulativeReturned,
            netDifference: item.lent - item.returned
        };
    });

    return (
        <div className='space-y-8'>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Total Lent Card */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200/50">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Lent</p>
                            <p className="text-2xl font-bold text-blue-600">{totalLent}</p>
                        </div>
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                            <MdTrendingUp className="w-5 h-5 text-white" />
                        </div>
                    </div>
                </div>

                {/* Total Returned Card */}
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-200/50">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Returned</p>
                            <p className="text-2xl font-bold text-emerald-600">{totalReturned}</p>
                        </div>
                        <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center">
                            <MdShowChart className="w-5 h-5 text-white" />
                        </div>
                    </div>
                </div>

                {/* Net Balance Card (dynamically colored) */}
                <div className={`bg-gradient-to-br ${netBalance >= 0 ? 'from-amber-50 to-orange-50' : 'from-red-50 to-pink-50'} rounded-xl p-4 border ${netBalance >= 0 ? 'border-amber-200/50' : 'border-red-200/50'}`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Net Balance</p>
                            <p className={`text-2xl font-bold ${netBalance >= 0 ? 'text-amber-600' : 'text-red-600'}`}>
                                {netBalance > 0 ? '+' : ''}{netBalance}
                            </p>
                        </div>
                        <div className={`w-10 h-10 bg-gradient-to-r ${netBalance >= 0 ? 'from-amber-500 to-orange-500' : 'from-red-500 to-pink-500'} rounded-lg flex items-center justify-center`}>
                            <MdBarChart className="w-5 h-5 text-white" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Charts Container */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                {/* Monthly Lending/Return Bar Chart */}
                <div className='bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-xl'>
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <MdBarChart className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <h3 className='text-lg font-semibold text-gray-900'>Monthly Activity</h3>
                            <p className='text-sm text-gray-600'>Books lent vs returned by month</p>
                        </div>
                    </div>

                    {monthlyLendingData.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <MdBarChart className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-gray-500 font-medium mb-2">No lending data available</p>
                            <p className="text-gray-400 text-sm text-center">Charts will appear here once you have lending activity</p>
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={320}>
                            <BarChart
                                data={monthlyLendingData}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                barCategoryGap="20%"
                            >
                                <defs>
                                    <linearGradient id="lentGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#6366f1" stopOpacity={0.8}/>
                                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.6}/>
                                    </linearGradient>
                                    <linearGradient id="returnedGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#10b981" stopOpacity={0.8}/>
                                        <stop offset="100%" stopColor="#059669" stopOpacity={0.6}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.6} />
                                <XAxis
                                    dataKey="month"
                                    tick={{ fontSize: 12, fill: '#64748b' }}
                                    tickLine={{ stroke: '#cbd5e1' }}
                                    axisLine={{ stroke: '#cbd5e1' }}
                                />
                                <YAxis
                                    tick={{ fontSize: 12, fill: '#64748b' }}
                                    tickLine={{ stroke: '#cbd5e1' }}
                                    axisLine={{ stroke: '#cbd5e1' }}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend content={<CustomLegend />} />
                                <Bar
                                    dataKey="lent"
                                    fill="url(#lentGradient)"
                                    name="Books Lent"
                                    radius={[4, 4, 0, 0]}
                                />
                                <Bar
                                    dataKey="returned"
                                    fill="url(#returnedGradient)"
                                    name="Books Returned"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Cumulative Trend Area Chart */}
                <div className='bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-xl'>
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                            <MdShowChart className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <h3 className='text-lg font-semibold text-gray-900'>Cumulative Trends</h3>
                            <p className='text-sm text-gray-600'>Running totals over time</p>
                        </div>
                    </div>

                    {monthlyLendingData.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <MdShowChart className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-gray-500 font-medium mb-2">No trend data available</p>
                            <p className="text-gray-400 text-sm text-center">Trend analysis will appear once you have multiple months of data</p>
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={320}>
                            <AreaChart
                                data={cumulativeData}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                                <defs>
                                    <linearGradient id="cumulativeLentGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3}/>
                                        <stop offset="100%" stopColor="#6366f1" stopOpacity={0.1}/>
                                    </linearGradient>
                                    <linearGradient id="cumulativeReturnedGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#10b981" stopOpacity={0.3}/>
                                        <stop offset="100%" stopColor="#10b981" stopOpacity={0.1}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.6} />
                                <XAxis
                                    dataKey="month"
                                    tick={{ fontSize: 12, fill: '#64748b' }}
                                    tickLine={{ stroke: '#cbd5e1' }}
                                    axisLine={{ stroke: '#cbd5e1' }}
                                />
                                <YAxis
                                    tick={{ fontSize: 12, fill: '#64748b' }}
                                    tickLine={{ stroke: '#cbd5e1' }}
                                    axisLine={{ stroke: '#cbd5e1' }}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend content={<CustomLegend />} />
                                <Area
                                    type="monotone"
                                    dataKey="cumulativeLent"
                                    stackId="1"
                                    stroke="#6366f1"
                                    strokeWidth={2}
                                    fill="url(#cumulativeLentGradient)"
                                    name="Cumulative Lent"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="cumulativeReturned"
                                    stackId="1"
                                    stroke="#10b981"
                                    strokeWidth={2}
                                    fill="url(#cumulativeReturnedGradient)"
                                    name="Cumulative Returned"
                                />
                                <ReferenceLine y={0} stroke="#64748b" strokeDasharray="2 2" />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            
        </div>
    );
};

export default DashboardCharts;
