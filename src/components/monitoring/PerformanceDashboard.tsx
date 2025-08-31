'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Progress,
  Grid,
  GridItem,
  Card,
  CardHeader,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react';
import { 
  getPerformanceMonitors, 
  PerformanceAlert,
  DEFAULT_PERFORMANCE_BUDGET,
  reportPerformanceSummary 
} from '@/utils/performance';
import { getRUM } from '@/utils/rum';

interface PerformanceDashboardProps {
  showRealTimeData?: boolean;
  refreshInterval?: number;
}

export function PerformanceDashboard({ 
  showRealTimeData = true, 
  refreshInterval = 5000 
}: PerformanceDashboardProps) {
  const [metrics, setMetrics] = useState<any>({});
  const [resourceSummary, setResourceSummary] = useState<any>({});
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const updateData = () => {
      const monitors = getPerformanceMonitors();
      
      if (monitors.webVitals) {
        setMetrics(monitors.webVitals.getSummary());
      }
      
      if (monitors.resources) {
        setResourceSummary(monitors.resources.getResourceSummary());
      }
      
      setIsLoading(false);
    };

    // Initial load
    updateData();

    // Set up refresh interval if real-time data is enabled
    let interval: NodeJS.Timeout | undefined;
    if (showRealTimeData) {
      interval = setInterval(updateData, refreshInterval);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [showRealTimeData, refreshInterval]);

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'good': return 'green';
      case 'needs-improvement': return 'yellow';
      case 'poor': return 'red';
      default: return 'gray';
    }
  };

  const formatValue = (name: string, value: number) => {
    if (name === 'CLS') {
      return value.toFixed(3);
    }
    return Math.round(value).toString();
  };

  const getUnit = (name: string) => {
    if (name === 'CLS') return '';
    return 'ms';
  };

  const getBudgetUsage = (name: string, value: number) => {
    const budget = DEFAULT_PERFORMANCE_BUDGET[name.toLowerCase() as keyof typeof DEFAULT_PERFORMANCE_BUDGET];
    if (!budget) return 0;
    return Math.min((value / budget) * 100, 100);
  };

  if (isLoading) {
    return (
      <Box p={6}>
        <Text>Loading performance data...</Text>
      </Box>
    );
  }

  return (
    <Box p={6} maxW="1200px" mx="auto">
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <HStack justify="space-between">
          <Box>
            <Text fontSize="2xl" fontWeight="bold">Performance Dashboard</Text>
            <Text color="gray.600">Real-time performance monitoring and analytics</Text>
          </Box>
          <HStack spacing={2}>
            <Button
              size="sm"
              onClick={() => reportPerformanceSummary()}
            >
              Export Report
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Refresh
            </Button>
          </HStack>
        </HStack>

        {/* Alerts */}
        {alerts.length > 0 && (
          <Alert status="warning">
            <AlertIcon />
            <Box>
              <AlertTitle>Performance Alerts!</AlertTitle>
              <AlertDescription>
                {alerts.length} performance issue(s) detected. Check the details below.
              </AlertDescription>
            </Box>
          </Alert>
        )}

        <Tabs>
          <TabList>
            <Tab>Core Web Vitals</Tab>
            <Tab>Resource Performance</Tab>
            <Tab>Budget Analysis</Tab>
            <Tab>Real User Data</Tab>
          </TabList>

          <TabPanels>
            {/* Core Web Vitals Tab */}
            <TabPanel>
              <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={6}>
                {Object.entries(metrics).map(([name, metric]: [string, any]) => (
                  <GridItem key={name}>
                    <Card>
                      <CardHeader pb={2}>
                        <HStack justify="space-between">
                          <Text fontWeight="bold">{name}</Text>
                          <Badge
                            colorScheme={getRatingColor(metric.rating)}
                            variant="subtle"
                          >
                            {metric.rating}
                          </Badge>
                        </HStack>
                      </CardHeader>
                      <CardBody pt={0}>
                        <Stat>
                          <StatNumber>
                            {formatValue(name, metric.value)}{getUnit(name)}
                          </StatNumber>
                          <StatHelpText>
                            Budget: {getBudgetUsage(name, metric.value).toFixed(0)}% used
                          </StatHelpText>
                        </Stat>
                        <Progress
                          value={getBudgetUsage(name, metric.value)}
                          colorScheme={getRatingColor(metric.rating)}
                          size="sm"
                          mt={2}
                        />
                      </CardBody>
                    </Card>
                  </GridItem>
                ))}
              </Grid>
            </TabPanel>

            {/* Resource Performance Tab */}
            <TabPanel>
              <VStack spacing={4} align="stretch">
                <Text fontSize="lg" fontWeight="bold">Resource Loading Summary</Text>
                
                {Object.keys(resourceSummary).length > 0 ? (
                  <TableContainer>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>Resource Type</Th>
                          <Th isNumeric>Count</Th>
                          <Th isNumeric>Total Size</Th>
                          <Th isNumeric>Avg Duration</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {Object.entries(resourceSummary).map(([type, data]: [string, any]) => (
                          <Tr key={type}>
                            <Td fontWeight="medium" textTransform="capitalize">{type}</Td>
                            <Td isNumeric>{data.count}</Td>
                            <Td isNumeric>{(data.totalSize / 1024).toFixed(1)} KB</Td>
                            <Td isNumeric>{data.avgDuration.toFixed(0)} ms</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Text color="gray.500">No resource data available yet.</Text>
                )}
              </VStack>
            </TabPanel>

            {/* Budget Analysis Tab */}
            <TabPanel>
              <VStack spacing={4} align="stretch">
                <Text fontSize="lg" fontWeight="bold">Performance Budget Analysis</Text>
                
                <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={4}>
                  {Object.entries(DEFAULT_PERFORMANCE_BUDGET).map(([budgetName, budgetValue]) => {
                    const metricName = budgetName.toUpperCase();
                    const currentMetric = metrics[metricName];
                    
                    if (!currentMetric) return null;
                    
                    const usage = getBudgetUsage(metricName, currentMetric.value);
                    const isOverBudget = usage > 100;
                    
                    return (
                      <Card key={budgetName} borderColor={isOverBudget ? 'red.200' : 'gray.200'}>
                        <CardBody>
                          <VStack align="stretch" spacing={2}>
                            <HStack justify="space-between">
                              <Text fontWeight="medium">{metricName}</Text>
                              <Badge
                                colorScheme={isOverBudget ? 'red' : usage > 80 ? 'yellow' : 'green'}
                              >
                                {usage.toFixed(0)}%
                              </Badge>
                            </HStack>
                            
                            <Progress
                              value={Math.min(usage, 100)}
                              colorScheme={isOverBudget ? 'red' : usage > 80 ? 'yellow' : 'green'}
                              size="sm"
                            />
                            
                            <HStack justify="space-between" fontSize="sm" color="gray.600">
                              <Text>
                                Current: {formatValue(metricName, currentMetric.value)}{getUnit(metricName)}
                              </Text>
                              <Text>
                                Budget: {budgetName === 'cls' ? budgetValue : Math.round(budgetValue)}{getUnit(metricName)}
                              </Text>
                            </HStack>
                          </VStack>
                        </CardBody>
                      </Card>
                    );
                  })}
                </Grid>
              </VStack>
            </TabPanel>

            {/* Real User Data Tab */}
            <TabPanel>
              <VStack spacing={4} align="stretch">
                <Text fontSize="lg" fontWeight="bold">Real User Monitoring</Text>
                
                <Card>
                  <CardBody>
                    <VStack align="stretch" spacing={4}>
                      <HStack justify="space-between">
                        <Text fontWeight="medium">Session Information</Text>
                        <Badge colorScheme="blue">Active</Badge>
                      </HStack>
                      
                      <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={4}>
                        <Stat>
                          <StatLabel>Session ID</StatLabel>
                          <StatNumber fontSize="md">
                            {getRUM()?.getSessionId()?.slice(-8) || 'N/A'}
                          </StatNumber>
                        </Stat>
                        
                        <Stat>
                          <StatLabel>Page URL</StatLabel>
                          <StatNumber fontSize="md">
                            {typeof window !== 'undefined' ? window.location.pathname : 'N/A'}
                          </StatNumber>
                        </Stat>
                        
                        <Stat>
                          <StatLabel>Viewport</StatLabel>
                          <StatNumber fontSize="md">
                            {typeof window !== 'undefined' 
                              ? `${window.innerWidth}×${window.innerHeight}`
                              : 'N/A'
                            }
                          </StatNumber>
                        </Stat>
                        
                        <Stat>
                          <StatLabel>Connection</StatLabel>
                          <StatNumber fontSize="md">
                            {typeof navigator !== 'undefined' && 'connection' in navigator
                              ? (navigator as any).connection?.effectiveType || 'Unknown'
                              : 'Unknown'
                            }
                          </StatNumber>
                        </Stat>
                      </Grid>
                    </VStack>
                  </CardBody>
                </Card>

                <Alert status="info">
                  <AlertIcon />
                  <Box>
                    <AlertTitle>Real User Monitoring</AlertTitle>
                    <AlertDescription>
                      RUM data is being collected from real user sessions. 
                      This helps identify performance issues in production environments.
                    </AlertDescription>
                  </Box>
                </Alert>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Box>
  );
}