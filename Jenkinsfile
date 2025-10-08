@Library('lambda-sharedlibrary-v1')_

pipeline {
    agent any  
    stages {
        stage('Build') {
            steps {
                script {                  
                   configFileProvider([configFile(fileId: "deployLambda", variable: 'deployLambda',targetLocation:"$WORKSPACE/deployLambda.groovy")]){
                       	def rootDir = pwd()
						def tools = load "${rootDir}/deployLambda.groovy"                       
                        tools.fullDeployment()
                    }             
                }
            }
        }
    }
}