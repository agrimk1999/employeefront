const sonarqubeScanner =  require('sonarqube-scanner');
sonarqubeScanner(
    {
        serverUrl:  'http://localhost:9000',
        options : {
            'sonar.sources':  './microservices/',
            'sonar.tests':  './microservices/',
            'sonar.inclusions'  :  'microservices/employee.service.js', // Entry point of your code
            'sonar.test.inclusions':  'microservices/employee.test.js',
            'sonar.javascript.lcov.reportPaths':  'coverage/lcov.info',
            'sonar.testExecutionReportPaths':  'coverage/test-reporter.xml',
            'sonar.dynamicAnalysis':'reuseReports'
        }
    }, () => {});