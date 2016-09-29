package CustomFieldAutomator::Callbacks;

use strict;
use utf8;
use MT::Website;
use MT::Blog;
use MT::Util;

use constant DEBUG => 1;

sub template_source_footer {
    my ($cb, $app, $tmpl) = @_;
    my $blog = $app->blog;
    my $blog_id = (defined $blog) ? $blog->id : 0;
    my $scope = (!$blog_id) ? 'system' : 'blog:'.$blog_id;
    my $p = MT->component('CustomFieldAutomator');
    my $active = $p->get_config_value('active', $scope);
    my $version = $p->version;
    if ($active eq "1") {
        if ($app->param('__mode') eq "cfg_plugins") {
            my $key = $p->get_config_value('key_id', $scope);
            if ($key ne "") {
                $p->set_config_value('active', '0', $scope);
                $p->set_config_value('key_id', '0', $scope);
                my $extra = <<__MTML__;
<script type="text/javascript" id="custom_field_automator" data-key="__KEY__" src="plugins/CustomFieldAutomator/lib/CustomFieldAutomator/Automator.js?v=__VERSION__"></script>
__MTML__
                $extra =~ s/__KEY__/$key/g;
                $extra =~ s/__VERSION__/$version/g;
                $$tmpl =~ s/(<\/body>)/$extra\n$1/g;
            }
        }
    }
    if ($app->param('__mode') eq "view") {
        if ($app->param('_type') eq "field") {
            my $extra = <<__MTML__;
<script type="text/javascript" src="plugins/CustomFieldAutomator/lib/CustomFieldAutomator/Automator.js?v=__VERSION__"></script>
__MTML__
            $extra =~ s/__VERSION__/$version/g;
            $$tmpl =~ s/(<\/body>)/$extra\n$1/g;
        }
    }
}

sub doLog {
    my ($msg, $class) = @_;
    return unless defined($msg);

    require MT::Log;
    my $log = new MT::Log;
    $log->message($msg);
    $log->level(MT::Log::DEBUG());
    $log->class($class) if $class;
    $log->save or die $log->errstr;
}

1;
