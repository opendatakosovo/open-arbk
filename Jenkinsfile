// -*- mode: groovy -*-
// vim: set filetype=groovy :
node {
    try {
        checkout scm
        notifyBuild('STARTED')
        stage('Build') {
            sh '''rm -rf venv/
            bash install.sh
            '''
        }
        stage('Deploy') {
            sh '''./deploy/deploy.sh'''
        }
  } catch (e) {
    // If there was an exception thrown, the build failed
    currentBuild.result = "FAILED"
    throw e
  } finally {
    // Success or failure, always send notifications
      notifyBuild(currentBuild.result)
  }
}
def commitSha1() {
    sh 'git rev-parse --short HEAD > commit'
    def commit = readFile('commit').trim()
    sh 'rm commit'
    commit
}
def commitMessage() {
    def commitSha = commitSha1()
    sh 'git log ' + commitSha + '^..' + commitSha + ' --pretty=format:"%h%x09%an%x09%s" > commitMessage'
    def commitMessage = readFile('commitMessage')
    sh 'rm commitMessage'
    commitMessage
}
def notifyBuild(String buildStatus) {
  // build status of null means successful
  buildStatus =  buildStatus ?: 'SUCCESSFUL'
    
    def commitMessage = commitMessage()
    
    GIT_COMMIT_EMAIL  = sh (
      script: 'git show --name-only --pretty=%an',
      returnStdout: true
    ).trim()
    echo "Git committer email: ${GIT_COMMIT_EMAIL}"
  
    BUILD_FULL = sh (
        script: "git log -1 --pretty=%B | grep '\\[jenkins-full]'",
        returnStatus: true
    ) == 0
    echo "Build full flag: ${BUILD_FULL}"
  // Default values
  def colorName = 'RED'
  def colorCode = '#FF0000'
  def subject = "${buildStatus}:'[${env.BUILD_NUMBER}]'"
    
  def summary = "${subject} - Author: ${GIT_COMMIT_EMAIL} ${commitMessage}"
    
  def details = """<p>STARTED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]':</p>
    <p>Check console output at &QUOT;<a href='${env.BUILD_URL}'>${env.JOB_NAME} [${env.BUILD_NUMBER}]</a>&QUOT;</p><br/>
    <h4>Author: </h4> ${GIT_COMMIT_EMAIL}"""
  // Override default values based on build status
    if( buildStatus != "STARTED"){
        if (buildStatus == 'SUCCESSFUL') {
            color = 'GREEN'
            colorCode = '#23b985'
        } else {
            color = 'RED'
            colorCode = '#a50000'
        }
    // Send notifications
    slackSend(color: colorCode, message: summary)
    }
}
